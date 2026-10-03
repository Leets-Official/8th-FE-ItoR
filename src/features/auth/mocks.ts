import type { AuthUser } from './types';

// 인증 API 연동 전까지 로그인에 쓰는 목업 계정
const MOCK_ACCOUNTS: (AuthUser & { password: string })[] = [
  { email: 'admin', password: '1111', nickname: '닉네임' },
];

export function loginWithMockAccount(email: string, password: string): AuthUser | undefined {
  const account = MOCK_ACCOUNTS.find(
    (candidate) => candidate.email === email.trim() && candidate.password === password,
  );
  if (!account) return undefined;

  return {
    email: account.email,
    nickname: account.nickname,
    profileImageUrl: account.profileImageUrl,
  };
}
