import { useMemo, useState, type ReactNode } from 'react';
import { AuthContext, type AuthContextValue } from './authContext';
import { loginWithMockAccount } from './mocks';
import type { AuthUser } from './types';

// 새로고침해도 로그인이 풀리지 않도록 탭 단위로 보관한다 (탭을 닫으면 로그아웃)
const STORAGE_KEY = 'gitlog:auth-user';

function readStoredUser(): AuthUser | undefined {
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    return stored ? (JSON.parse(stored) as AuthUser) : undefined;
  } catch {
    return undefined;
  }
}

function writeStoredUser(user: AuthUser | undefined) {
  try {
    if (user) sessionStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    else sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // 저장소를 쓸 수 없으면 메모리 상태만 유지한다
  }
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [currentUser, setCurrentUser] = useState(readStoredUser);

  const value = useMemo<AuthContextValue>(
    () => ({
      currentUser,
      login(email, password) {
        const result = loginWithMockAccount(email, password);
        if ('error' in result) return result.error;

        setCurrentUser(result.user);
        writeStoredUser(result.user);
        return undefined;
      },
      logout() {
        setCurrentUser(undefined);
        writeStoredUser(undefined);
      },
    }),
    [currentUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
