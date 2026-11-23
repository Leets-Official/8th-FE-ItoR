// 요청 중에 만료되지 않도록 30초 먼저 재발급한다
const REFRESH_BUFFER_MS = 30_000;

export function isAccessTokenExpired(token: string) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return true;

    const payload: unknown = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
    if (
      typeof payload !== 'object' ||
      payload === null ||
      !('exp' in payload) ||
      typeof payload.exp !== 'number' ||
      !Number.isFinite(payload.exp)
    ) {
      return true;
    }

    // 서명 검증은 서버가 하고, 여기서는 재발급 시점만 판단한다
    return payload.exp * 1000 <= Date.now() + REFRESH_BUFFER_MS;
  } catch {
    return true;
  }
}
