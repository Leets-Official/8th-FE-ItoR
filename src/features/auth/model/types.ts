import type { User } from '@/features/user';

export interface AuthUser extends User {
  email: string;
  // 사이드바 프로필에 보이는 한 줄 소개
  introduction?: string;
}

export type LoginError = 'unregistered-email' | 'wrong-password';

export interface SignUpInput {
  email: string;
  password: string;
  name: string;
  // YYYY-MM-DD
  birthDate: string;
  nickname: string;
  introduction?: string;
  profileImageUrl?: string;
}

export type SignUpError = 'duplicate-email';
