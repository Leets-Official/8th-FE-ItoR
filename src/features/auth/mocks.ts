import type { AuthUser, LoginError } from './types';

// 인증 API 연동 전까지 로그인에 쓰는 목업 계정
const MOCK_ACCOUNTS: (AuthUser & { password: string })[] = [
  { email: 'admin@gitlog.com', password: '1111', nickname: '닉네임', introduction: '한 줄 소개' },
];

export function loginWithMockAccount(
  email: string,
  password: string,
): { user: AuthUser } | { error: LoginError } {
  const account = MOCK_ACCOUNTS.find((candidate) => candidate.email === email.trim());
  if (!account) return { error: 'unregistered-email' };
  if (account.password !== password) return { error: 'wrong-password' };

  return {
    user: {
      email: account.email,
      nickname: account.nickname,
      profileImageUrl: account.profileImageUrl,
      introduction: account.introduction,
    },
  };
}
