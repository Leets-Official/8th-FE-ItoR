import axios, {
  AxiosError,
  isAxiosError,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios';
import { isAccessTokenExpired } from './isAccessTokenExpired';
import { clearTokens, getAccessToken, getRefreshToken, saveTokens } from './tokenStorage';

declare module 'axios' {
  interface AxiosRequestConfig {
    // 비로그인으로도 부를 수 있는 API면 true. 토큰을 붙이지 않고 만료돼도 재발급하지 않는다
    isPublic?: boolean;
  }
}

// 세션이 만료돼 요청을 보내지 않았을 때의 에러 코드. 서버의 4xx 응답(ERR_BAD_REQUEST)과 구분한다
export const SESSION_EXPIRED_ERROR_CODE = 'ERR_SESSION_EXPIRED';

// 서버는 모든 응답을 { code, message, data }로 감싸 보낸다
export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

interface ReissueResponse {
  accessToken: string;
  refreshToken: string;
}

interface RetryableConfig extends InternalAxiosRequestConfig {
  // 재발급한 토큰으로 이미 한 번 다시 보낸 요청이면 true. 또 401이면 실패로 끝낸다
  hasRetried?: boolean;
}

// 재발급까지 실패해 로그인이 풀렸을 때 부른다. 로그인 상태(AuthProvider)를 비우는 데 쓴다
const sessionExpiredListeners = new Set<() => void>();

export function onSessionExpired(listener: () => void) {
  sessionExpiredListeners.add(listener);
  return () => {
    sessionExpiredListeners.delete(listener);
  };
}

function expireSession() {
  clearTokens();
  sessionExpiredListeners.forEach((listener) => listener());
}

async function reissueTokens() {
  const refreshToken = getRefreshToken();
  // 로그아웃했거나 다른 요청의 재발급이 이미 실패해 토큰을 지웠다
  if (!refreshToken) {
    if (getAccessToken()) expireSession();
    return false;
  }

  try {
    // 만료된 액세스 토큰이 붙지 않게 인터셉터가 없는 기본 axios로 보낸다
    const { data } = await axios.post<ApiResponse<ReissueResponse | null>>(
      '/auth/reissue',
      { refreshToken },
      { baseURL: api.defaults.baseURL },
    );
    // 기다리는 동안 로그아웃하거나 다른 계정으로 로그인했으면 이전 세션을 복원하지 않는다
    if (getRefreshToken() !== refreshToken) return false;
    if (data.data?.accessToken && data.data.refreshToken) {
      saveTokens(data.data);
      return true;
    }
  } catch {
    // 리프레시 토큰도 만료됐거나 잘못됐으면 아래에서 로그아웃한다
  }

  if (getRefreshToken() === refreshToken) expireSession();
  return false;
}

// 여러 요청이 한꺼번에 만료돼도 재발급은 한 번만 보내고 결과를 함께 기다린다
let reissuePromise: Promise<boolean> | undefined;

function reissueOnce() {
  reissuePromise ??= reissueTokens().finally(() => {
    reissuePromise = undefined;
  });
  return reissuePromise;
}

function isProtectedBackendRequest(config: InternalAxiosRequestConfig) {
  if (config.isPublic) return false;

  // 외부 URL(S3 등)로 보내는 요청에는 토큰을 붙이지 않는다
  const backendUrl = new URL(api.defaults.baseURL || '/', window.location.origin);
  const requestUrl = new URL(api.getUri(config), window.location.origin);
  const basePath = backendUrl.pathname.replace(/\/$/, '');
  if (requestUrl.origin !== backendUrl.origin || !requestUrl.pathname.startsWith(`${basePath}/`)) {
    return false;
  }

  // 로그인·가입·재발급은 토큰 없이 보낸다
  const path = requestUrl.pathname.slice(basePath.length);
  return path !== '/auth' && !path.startsWith('/auth/');
}

api.interceptors.request.use(async (config: RetryableConfig) => {
  if (!isProtectedBackendRequest(config)) return config;

  let accessToken = getAccessToken();
  if (!accessToken && !getRefreshToken()) return config;

  if (!config.hasRetried && (!accessToken || isAccessTokenExpired(accessToken))) {
    if (!(await reissueOnce())) {
      throw new AxiosError('로그인이 만료되었습니다.', SESSION_EXPIRED_ERROR_CODE, config);
    }
    accessToken = getAccessToken();
  }

  if (!accessToken) {
    throw new AxiosError('인증 토큰이 없습니다.', SESSION_EXPIRED_ERROR_CODE, config);
  }
  config.headers.set('Authorization', `Bearer ${accessToken}`);
  return config;
});

// 서버는 토큰이 만료되거나 잘못되면 HTTP 401 대신 200에 본문 code 401로 응답하기도 해서 둘 다 본다.
// 토큰이 필요한 일부 API(/posts/token 등)는 만료된 토큰에 500과 'JWT expired …' 메시지로 응답해 이것도 만료로 본다
function isUnauthorized(response?: AxiosResponse) {
  if (!response) return false;
  const body: unknown = response.data;
  const bodyCode = typeof body === 'object' && body !== null && 'code' in body && body.code;
  const bodyMessage =
    typeof body === 'object' && body !== null && 'message' in body && body.message;
  const isJwtExpired =
    response.status === 500 &&
    typeof bodyMessage === 'string' &&
    bodyMessage.startsWith('JWT expired');
  return response.status === 401 || bodyCode === 401 || isJwtExpired;
}

function toAxiosError(failure: AxiosResponse | AxiosError) {
  if (failure instanceof AxiosError) return failure;
  return new AxiosError(
    '인증에 실패했습니다.',
    AxiosError.ERR_BAD_RESPONSE,
    failure.config,
    failure.request,
    failure,
  );
}

async function retryAfterReissue(config: RetryableConfig, failure: AxiosResponse | AxiosError) {
  const sentToken = config.headers.Authorization;
  // 로그인·가입 실패의 401이나 토큰 없이 보낸 요청은 재발급과 상관없다
  if (!sentToken || config.hasRetried || !isProtectedBackendRequest(config)) {
    throw toAxiosError(failure);
  }

  // 다른 요청이 먼저 재발급을 마쳤으면 새 토큰으로 바로 다시 보낸다
  const currentToken = getAccessToken();
  const isRenewed = Boolean(currentToken) && sentToken !== `Bearer ${currentToken}`;
  if (!isRenewed && !(await reissueOnce())) throw toAxiosError(failure);

  // 요청 인터셉터가 새 액세스 토큰을 다시 붙인다
  config.hasRetried = true;
  return api.request(config);
}

api.interceptors.response.use(
  (response) =>
    isUnauthorized(response) ? retryAfterReissue(response.config, response) : response,
  (error) => {
    if (isAxiosError(error) && error.config && isUnauthorized(error.response)) {
      return retryAfterReissue(error.config, error);
    }
    return Promise.reject(error);
  },
);
