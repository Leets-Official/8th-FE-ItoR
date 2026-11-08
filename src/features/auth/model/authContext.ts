import { createContext } from 'react';
import type {
  AuthUser,
  KakaoLoginError,
  LoginError,
  ProfileUpdateFailure,
  ProfileUpdateInput,
  SignUpFailure,
  SignUpInput,
} from './types';

export interface AuthContextValue {
  // 없으면 비로그인 상태
  currentUser?: AuthUser;
  // 성공하면 undefined, 실패하면 실패 이유를 돌려준다
  login: (email: string, password: string) => Promise<LoginError | undefined>;
  // 카카오 인가 코드로 로그인한다. 성공하면 undefined, 실패하면 실패 이유를 돌려준다
  loginWithKakao: (code: string) => Promise<KakaoLoginError | undefined>;
  // 가입만 하고 로그인은 하지 않는다 (완료 모달에서 로그인하기로 이어진다). 성공하면 undefined, 실패하면 실패 이유를 돌려준다
  signUp: (input: SignUpInput) => Promise<SignUpFailure | undefined>;
  // 로그인한 사용자의 프로필을 바꾼다. 성공하면(또는 로그인하지 않았으면) undefined, 실패하면 실패 이유를 돌려준다
  updateProfile: (input: ProfileUpdateInput) => Promise<ProfileUpdateFailure | undefined>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
