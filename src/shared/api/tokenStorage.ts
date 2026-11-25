// 로그인 상태(AuthProvider)와 같이 탭 단위로 보관한다. 탭을 닫으면 토큰도 사라진다
// 두 토큰을 한 항목에 담아 저장이 중간에 실패해도 한쪽만 바뀌지 않게 한다
const TOKENS_KEY = 'gitlog:auth-tokens';
// 두 토큰을 따로 저장하던 이전 버전의 키. 그 버전에서 로그인한 탭은 새로고침해도 로그인이 유지돼야 한다
const LEGACY_ACCESS_TOKEN_KEY = 'gitlog:access-token';
const LEGACY_REFRESH_TOKEN_KEY = 'gitlog:refresh-token';

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

// 로그인할 때마다 새로 정하고 재발급해도 유지되는 세션 id. 리프레시 토큰은 재발급하면 바뀌어
// 응답이 늦게 온 요청이 같은 로그인에서 보낸 것인지 토큰만으로는 알 수 없다
interface StoredSession extends AuthTokens {
  sessionId: string;
}

// 저장소의 값은 타입 보장이 없으므로 토큰의 구조를 확인한다
function isAuthTokens(value: unknown): value is AuthTokens {
  return (
    typeof value === 'object' &&
    value !== null &&
    'accessToken' in value &&
    typeof value.accessToken === 'string' &&
    'refreshToken' in value &&
    typeof value.refreshToken === 'string'
  );
}

function hasSessionId(value: AuthTokens): value is StoredSession {
  return 'sessionId' in value && typeof value.sessionId === 'string';
}

function writeSession(session: StoredSession) {
  sessionStorage.setItem(TOKENS_KEY, JSON.stringify(session));
}

// 이전 키에 남은 두 토큰을 새 항목으로 한 번 옮긴다. 한쪽만 있으면 쓸 수 없으니 버린다
function migrateLegacyTokens() {
  const accessToken = sessionStorage.getItem(LEGACY_ACCESS_TOKEN_KEY);
  const refreshToken = sessionStorage.getItem(LEGACY_REFRESH_TOKEN_KEY);
  if (accessToken === null && refreshToken === null) return;

  if (accessToken && refreshToken) {
    writeSession({ accessToken, refreshToken, sessionId: crypto.randomUUID() });
  }
  sessionStorage.removeItem(LEGACY_ACCESS_TOKEN_KEY);
  sessionStorage.removeItem(LEGACY_REFRESH_TOKEN_KEY);
}

function readSession() {
  try {
    if (sessionStorage.getItem(TOKENS_KEY) === null) migrateLegacyTokens();
    const stored = sessionStorage.getItem(TOKENS_KEY);
    if (!stored) return undefined;

    const parsed: unknown = JSON.parse(stored);
    if (!isAuthTokens(parsed)) return undefined;
    if (hasSessionId(parsed)) return parsed;

    // 세션 id 없이 토큰만 저장하던 이전 버전의 항목은 id를 붙여 다시 저장한다
    const session = {
      accessToken: parsed.accessToken,
      refreshToken: parsed.refreshToken,
      sessionId: crypto.randomUUID(),
    };
    writeSession(session);
    return session;
  } catch {
    return undefined;
  }
}

export function getAccessToken() {
  return readSession()?.accessToken;
}

export function getRefreshToken() {
  return readSession()?.refreshToken;
}

export function getSessionId() {
  return readSession()?.sessionId;
}

// 로그인해서 받은 토큰을 새 세션으로 저장한다
// 저장하지 못하면 던진다. 삼키면 호출한 쪽이 성공으로 보고 이전 토큰으로 요청을 이어 간다
export function startSession({ accessToken, refreshToken }: AuthTokens) {
  writeSession({ accessToken, refreshToken, sessionId: crypto.randomUUID() });
}

// 재발급한 토큰을 같은 세션에 저장한다. 저장하지 못하면 startSession과 같이 던진다
export function saveTokens({ accessToken, refreshToken }: AuthTokens) {
  writeSession({ accessToken, refreshToken, sessionId: getSessionId() ?? crypto.randomUUID() });
}

export function clearTokens() {
  try {
    sessionStorage.removeItem(TOKENS_KEY);
    sessionStorage.removeItem(LEGACY_ACCESS_TOKEN_KEY);
    sessionStorage.removeItem(LEGACY_REFRESH_TOKEN_KEY);
  } catch {
    // 저장소를 쓸 수 없으면 지울 토큰도 없다
  }
}
