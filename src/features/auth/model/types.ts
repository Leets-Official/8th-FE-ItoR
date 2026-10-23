import type { User } from '@/features/user';

export interface AuthUser extends User {
  email: string;
  name: string;
  // YYYY-MM-DD
  birthDate: string;
  // 사이드바 프로필에 보이는 한 줄 소개
  introduction?: string;
  // 있으면 소셜 가입 계정 — 비밀번호가 없다
  provider?: SocialProvider;
}

// unknown: 네트워크 오류나 서버 오류처럼 입력값과 상관없는 실패
export type LoginError = 'invalid-credentials' | 'unknown';

// unregistered: 카카오 로그인은 됐지만 우리 서비스에 가입하지 않은 계정
export type KakaoLoginError = 'unregistered' | 'unknown';

// 비밀번호 대신 소셜 계정으로 로그인하는 가입 방식
export type SocialProvider = 'kakao';

export interface SignUpInput {
  email: string;
  // 소셜 가입이면 비밀번호 없이 provider로 로그인한다
  password?: string;
  provider?: SocialProvider;
  name: string;
  // YYYY-MM-DD
  birthDate: string;
  nickname: string;
  introduction?: string;
  profileImageUrl?: string;
}

// kakao-auth-required: 카카오 가입에 필요한 kakaoId가 없어 카카오 로그인을 다시 거쳐야 한다
export type SignUpError = 'duplicate-email' | 'invalid-input' | 'kakao-auth-required' | 'unknown';

export interface SignUpFailure {
  error: SignUpError;
  // 서버가 알려준 실패 이유. 화면에 그대로 보여준다
  message?: string;
}

// 내 프로필 설정에서 고칠 수 있는 항목. 가입 방식은 바꾸지 않는다
export interface ProfileUpdateInput extends Pick<
  AuthUser,
  'email' | 'name' | 'birthDate' | 'nickname' | 'introduction' | 'profileImageUrl'
> {
  // 있으면 비밀번호를 바꾼다. 소셜 가입 계정은 비밀번호가 없어 넘기지 않는다
  password?: string;
}

export type ProfileUpdateError = 'duplicate-email' | 'invalid-input' | 'unknown';

export interface ProfileUpdateFailure {
  error: ProfileUpdateError;
  // 서버가 알려준 실패 이유. 화면에 그대로 보여준다
  message?: string;
}
