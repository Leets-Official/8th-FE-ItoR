import { createContext } from 'react';

import type { StoredAuth } from '@/shared/api/authStorage';

import type { LoginPostRequest, LoginPostResponse } from './model/auth';

export type AuthContextValue = {
  auth: LoginPostResponse | null;
  isKakaoRegistrationRequired: boolean;
  login: (loginPostRequest: LoginPostRequest) => Promise<void>;
  completeLogin: (loginPostResponse: LoginPostResponse) => void;
  updateProfile: (
    profile: Pick<StoredAuth, 'nickname' | 'profilePicture' | 'introduction'>,
  ) => void;
  requireKakaoRegistration: () => void;
  dismissKakaoRegistration: () => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextValue | null>(null);
