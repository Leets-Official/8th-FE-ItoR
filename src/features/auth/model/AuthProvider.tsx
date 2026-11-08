import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { AuthContext, type AuthContextValue } from './authContext';
import { onSessionExpired } from '@/shared/api/instance';
import { clearTokens } from '@/shared/api/tokenStorage';
import { showToast } from '@/shared/ui';
import {
  registerWithEmail,
  registerWithKakao,
  requestKakaoLogin,
  requestLogin,
  updateMyProfile,
} from '../api/authApi';
import type { AuthUser } from './types';

// 새로고침해도 로그인이 풀리지 않도록 탭 단위로 보관한다 (탭을 닫으면 로그아웃)
const STORAGE_KEY = 'gitlog:auth-user';

// 저장소의 값은 타입 보장이 없으므로 사용자 정보의 구조를 확인한다
function isAuthUser(value: unknown): value is AuthUser {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return false;

  return (
    'nickname' in value &&
    typeof value.nickname === 'string' &&
    'email' in value &&
    typeof value.email === 'string' &&
    'name' in value &&
    typeof value.name === 'string' &&
    'birthDate' in value &&
    typeof value.birthDate === 'string' &&
    (!('profileImageUrl' in value) ||
      value.profileImageUrl === undefined ||
      typeof value.profileImageUrl === 'string') &&
    (!('introduction' in value) ||
      value.introduction === undefined ||
      typeof value.introduction === 'string') &&
    (!('provider' in value) || value.provider === undefined || value.provider === 'kakao')
  );
}

function readStoredUser(): AuthUser | undefined {
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (!stored) return undefined;

    const parsed: unknown = JSON.parse(stored);
    return isAuthUser(parsed) ? parsed : undefined;
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

  // 리프레시 토큰으로도 재발급하지 못하면 토큰은 이미 지워졌으니 화면의 로그인 상태만 비운다
  useEffect(
    () =>
      onSessionExpired(() => {
        setCurrentUser(undefined);
        writeStoredUser(undefined);
        showToast('negative', '로그인이 만료되었습니다. 다시 로그인해 주세요.');
      }),
    [],
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      currentUser,
      async login(email, password) {
        const result = await requestLogin(email, password);
        if ('error' in result) return result.error;

        setCurrentUser(result.user);
        writeStoredUser(result.user);
        return undefined;
      },
      async loginWithKakao(code) {
        const result = await requestKakaoLogin(code);
        if ('error' in result) return result.error;

        setCurrentUser(result.user);
        writeStoredUser(result.user);
        return undefined;
      },
      async signUp(input) {
        return input.provider === 'kakao' ? registerWithKakao(input) : registerWithEmail(input);
      },
      async updateProfile(input) {
        if (!currentUser) return undefined;

        const result = await updateMyProfile(input);
        if ('error' in result) return result;

        // 내 정보 응답에는 가입 방식이 없어 로그인할 때 정한 값을 유지한다
        const user = { ...result.user, provider: currentUser.provider };
        setCurrentUser(user);
        writeStoredUser(user);
        return undefined;
      },
      logout() {
        setCurrentUser(undefined);
        writeStoredUser(undefined);
        clearTokens();
      },
    }),
    [currentUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
