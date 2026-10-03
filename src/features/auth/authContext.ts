import { createContext } from 'react';
import type { AuthUser } from './types';

export interface AuthContextValue {
  // 없으면 비로그인 상태
  currentUser?: AuthUser;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
