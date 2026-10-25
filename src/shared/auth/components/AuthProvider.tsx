import { useEffect, useState, type ReactNode } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import {
  clearStoredAuth,
  readStoredAuth,
  subscribeAuthChange,
  updateStoredProfile,
  writeStoredAuth,
  type StoredAuth,
} from '@/shared/api/authStorage';

import { postLogin } from '../api/authApi';
import { AuthContext } from '../authContext';
import type { LoginPostRequest, LoginPostResponse } from '../model/auth';

type AuthProviderProps = {
  children: ReactNode;
};

/** 로그인 정보와 토큰 저장 동작을 애플리케이션 전체에 제공합니다. */
export function AuthProvider({ children }: AuthProviderProps) {
  const queryClient = useQueryClient();
  const [auth, setAuth] = useState<LoginPostResponse | null>(() => {
    const storedAuth = readStoredAuth();
    return storedAuth ? { ...storedAuth, httpStatus: '200 OK', responseMessage: '' } : null;
  });
  const [isKakaoRegistrationRequired, setIsKakaoRegistrationRequired] = useState(false);

  useEffect(
    () =>
      subscribeAuthChange((storedAuth) => {
        if (storedAuth) {
          setAuth({ ...storedAuth, httpStatus: '200 OK', responseMessage: '' });
          return;
        }

        setAuth(null);
        queryClient.clear();
      }),
    [queryClient],
  );

  function completeLogin(loginPostResponse: LoginPostResponse) {
    queryClient.clear();
    writeStoredAuth(loginPostResponse);
    setAuth(loginPostResponse);
  }

  async function login(loginPostRequest: LoginPostRequest) {
    const loginPostResponse = await postLogin(loginPostRequest);
    completeLogin(loginPostResponse);
  }

  function updateProfile(
    profile: Pick<StoredAuth, 'nickname' | 'profilePicture' | 'introduction'>,
  ) {
    updateStoredProfile(profile);
  }

  function requireKakaoRegistration() {
    setIsKakaoRegistrationRequired(true);
  }

  function dismissKakaoRegistration() {
    setIsKakaoRegistrationRequired(false);
  }

  function logout() {
    clearStoredAuth();
  }

  return (
    <AuthContext.Provider
      value={{
        auth,
        isKakaoRegistrationRequired,
        login,
        completeLogin,
        updateProfile,
        requireKakaoRegistration,
        dismissKakaoRegistration,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
