import { isRecord } from './response';

interface Tokens {
  accessToken: string;
  refreshToken: string;
}

type AuthMethod = 'email' | 'kakao';

const STORAGE_KEY = 'gitlog.auth';
const listeners = new Set<() => void>();
let accessToken: string | null = null;
let refreshToken: string | null = null;
let method: AuthMethod = 'email';

try {
  const saved = JSON.parse(sessionStorage.getItem(STORAGE_KEY) ?? 'null') as unknown;
  if (
    isRecord(saved) &&
    typeof saved.refreshToken === 'string' &&
    saved.refreshToken &&
    (saved.method === 'email' || saved.method === 'kakao')
  ) {
    refreshToken = saved.refreshToken;
    method = saved.method;
  }
} catch {
  // 저장소가 차단되었거나 저장 값이 손상되면 로그인하지 않은 상태로 시작한다.
}

let snapshot = { revision: 0, hasSession: Boolean(refreshToken), method };

export function getAuthSnapshot() {
  return snapshot;
}

export function subscribeAuthSession(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getAccessToken() {
  return accessToken;
}

export function getRefreshToken() {
  return refreshToken;
}

export function saveAuthTokens(tokens: Tokens, nextMethod: AuthMethod, newSession = false) {
  try {
    sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ refreshToken: tokens.refreshToken, method: nextMethod }),
    );
  } catch {
    throw new Error(
      '로그인 유지 정보를 저장할 수 없습니다. 브라우저의 저장소 설정을 확인해주세요.',
    );
  }
  accessToken = tokens.accessToken;
  refreshToken = tokens.refreshToken;
  method = nextMethod;
  if (newSession || !snapshot.hasSession) {
    snapshot = { revision: snapshot.revision + 1, hasSession: true, method };
    listeners.forEach((listener) => listener());
  }
}

export function clearAuthSession() {
  accessToken = null;
  refreshToken = null;
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // 브라우저가 저장소 접근을 차단해도 메모리의 인증 정보는 정리한다.
  } finally {
    snapshot = { revision: snapshot.revision + 1, hasSession: false, method };
    listeners.forEach((listener) => listener());
  }
}

export function isAccessTokenExpired(token: string, now = Date.now()) {
  try {
    const payload = token.split('.')[1];
    const value: unknown = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
    return isRecord(value) && typeof value.exp === 'number' && value.exp * 1000 <= now;
  } catch {
    return false;
  }
}
