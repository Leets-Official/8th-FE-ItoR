import type { AuthUser, LoginError, SignUpError, SignUpInput } from '../model/types';

type MockAccount = AuthUser & Partial<SignUpInput>;

// 인증 API 연동 전까지 로그인에 쓰는 목업 계정. 회원가입하면 새로고침 전까지 여기에 추가된다
const MOCK_ACCOUNTS: MockAccount[] = [
  {
    email: 'admin@gitlog.com',
    password: '1111',
    name: '김릿츠',
    birthDate: '2000-01-01',
    nickname: '닉네임',
    introduction: '한 줄 소개',
  },
];

function toAuthUser({
  email,
  name,
  birthDate,
  nickname,
  profileImageUrl,
  introduction,
  provider,
}: MockAccount): AuthUser {
  return { email, name, birthDate, nickname, profileImageUrl, introduction, provider };
}

export function loginWithMockAccount(
  email: string,
  password: string,
): { user: AuthUser } | { error: LoginError } {
  const account = MOCK_ACCOUNTS.find((candidate) => candidate.email === email.trim());
  if (!account) return { error: 'unregistered-email' };
  // 소셜 가입 계정은 비밀번호가 없어 이메일 로그인이 되지 않는다
  if (!account.password || account.password !== password) return { error: 'wrong-password' };

  return { user: toAuthUser(account) };
}

export function signUpWithMockAccount(
  input: SignUpInput,
): { user: AuthUser } | { error: SignUpError } {
  if (MOCK_ACCOUNTS.some((candidate) => candidate.email === input.email)) {
    return { error: 'duplicate-email' };
  }

  const account: MockAccount = { ...input };
  MOCK_ACCOUNTS.push(account);
  return { user: toAuthUser(account) };
}
