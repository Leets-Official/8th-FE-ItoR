export type StoredAuth = {
  accessToken: string;
  refreshToken: string;
  nickname: string;
  profilePicture: string | null;
  introduction: string | null;
};

const AUTH_STORAGE_KEY = 'itor.auth';
type AuthChangeListener = (auth: StoredAuth | null) => void;
const authChangeListeners = new Set<AuthChangeListener>();

function isNullableString(value: unknown): value is string | null {
  return typeof value === 'string' || value === null;
}

function isStoredAuth(value: unknown): value is StoredAuth {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const auth = value as Partial<StoredAuth>;
  return (
    typeof auth.accessToken === 'string' &&
    typeof auth.refreshToken === 'string' &&
    typeof auth.nickname === 'string' &&
    isNullableString(auth.profilePicture) &&
    isNullableString(auth.introduction)
  );
}

function notifyAuthChange(auth: StoredAuth | null) {
  authChangeListeners.forEach((listener) => listener(auth));
}

export function readStoredAuth(): StoredAuth | null {
  const storedAuth = window.localStorage.getItem(AUTH_STORAGE_KEY);

  if (!storedAuth) {
    return null;
  }

  try {
    const parsedAuth: unknown = JSON.parse(storedAuth);

    if (isStoredAuth(parsedAuth)) {
      return parsedAuth;
    }

    clearStoredAuth();
    return null;
  } catch {
    clearStoredAuth();
    return null;
  }
}

export function writeStoredAuth(auth: StoredAuth) {
  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(auth));
  notifyAuthChange(auth);
}

export function updateStoredTokens(accessToken: string, refreshToken: string) {
  const storedAuth = readStoredAuth();

  if (storedAuth) {
    writeStoredAuth({ ...storedAuth, accessToken, refreshToken });
  }
}

export function updateStoredProfile(
  profile: Pick<StoredAuth, 'nickname' | 'profilePicture' | 'introduction'>,
) {
  const storedAuth = readStoredAuth();

  if (storedAuth) {
    writeStoredAuth({ ...storedAuth, ...profile });
  }
}

export function clearStoredAuth() {
  window.localStorage.removeItem(AUTH_STORAGE_KEY);
  notifyAuthChange(null);
}

export function subscribeAuthChange(listener: AuthChangeListener) {
  authChangeListeners.add(listener);
  return () => {
    authChangeListeners.delete(listener);
  };
}
