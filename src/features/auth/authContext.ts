import { createContext } from 'react';
import type { AuthUser, LoginError } from './types';

export interface AuthContextValue {
  // 없으면 비로그인 상태
  currentUser?: AuthUser;
  // 성공하면 undefined, 실패하면 실패 이유를 돌려준다
  login: (email: string, password: string) => LoginError | undefined;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
