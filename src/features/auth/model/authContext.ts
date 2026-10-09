import { createContext } from 'react';
import type { AuthUser, LoginError, SignUpError, SignUpInput } from './types';

export interface AuthContextValue {
  // 없으면 비로그인 상태
  currentUser?: AuthUser;
  // 성공하면 undefined, 실패하면 실패 이유를 돌려준다
  login: (email: string, password: string) => LoginError | undefined;
  // 가입만 하고 로그인은 하지 않는다 (완료 모달에서 로그인하기로 이어진다). 성공하면 undefined, 실패하면 실패 이유를 돌려준다
  signUp: (input: SignUpInput) => SignUpError | undefined;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
