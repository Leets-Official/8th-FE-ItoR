// 로그인 상태(AuthProvider)와 같이 탭 단위로 보관한다. 탭을 닫으면 토큰도 사라진다
// 두 토큰을 한 항목에 담아 저장이 중간에 실패해도 한쪽만 바뀌지 않게 한다
const TOKENS_KEY = 'gitlog:auth-tokens';

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
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

function readTokens() {
  try {
    const stored = sessionStorage.getItem(TOKENS_KEY);
    if (!stored) return undefined;

    const parsed: unknown = JSON.parse(stored);
    return isAuthTokens(parsed) ? parsed : undefined;
  } catch {
    return undefined;
  }
}

export function getAccessToken() {
  return readTokens()?.accessToken;
}

export function getRefreshToken() {
  return readTokens()?.refreshToken;
}

// 저장하지 못하면 던진다. 삼키면 호출한 쪽이 성공으로 보고 이전 토큰으로 요청을 이어 간다
export function saveTokens({ accessToken, refreshToken }: AuthTokens) {
  sessionStorage.setItem(TOKENS_KEY, JSON.stringify({ accessToken, refreshToken }));
}

export function clearTokens() {
  try {
    sessionStorage.removeItem(TOKENS_KEY);
  } catch {
    // 저장소를 쓸 수 없으면 지울 토큰도 없다
  }
}
