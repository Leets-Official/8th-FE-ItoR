// 로그인 상태(AuthProvider)와 같이 탭 단위로 보관한다. 탭을 닫으면 토큰도 사라진다
const ACCESS_TOKEN_KEY = 'gitlog:access-token';
const REFRESH_TOKEN_KEY = 'gitlog:refresh-token';

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export function getAccessToken() {
  try {
    return sessionStorage.getItem(ACCESS_TOKEN_KEY) ?? undefined;
  } catch {
    return undefined;
  }
}

export function getRefreshToken() {
  try {
    return sessionStorage.getItem(REFRESH_TOKEN_KEY) ?? undefined;
  } catch {
    return undefined;
  }
}

export function saveTokens({ accessToken, refreshToken }: AuthTokens) {
  try {
    sessionStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    sessionStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  } catch {
    // 저장소를 쓸 수 없으면 토큰 없이 요청한다
  }
}

export function clearTokens() {
  try {
    sessionStorage.removeItem(ACCESS_TOKEN_KEY);
    sessionStorage.removeItem(REFRESH_TOKEN_KEY);
  } catch {
    // 저장소를 쓸 수 없으면 지울 토큰도 없다
  }
}
