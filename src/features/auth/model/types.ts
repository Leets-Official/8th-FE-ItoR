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

export type LoginError = 'unregistered-email' | 'wrong-password';

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

export type SignUpError = 'duplicate-email';
