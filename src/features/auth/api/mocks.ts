import type {
  AuthUser,
  LoginError,
  ProfileUpdateError,
  ProfileUpdateInput,
  SignUpError,
  SignUpInput,
} from '../model/types';

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

// 목업 계정에도 반영해 두어야 로그아웃 후 다시 로그인했을 때 바뀐 프로필이 유지된다.
// 새로고침하면 목업 계정은 초기화되지만 로그인은 sessionStorage로 유지되므로, 계정이 없어도 user를 기준으로 돌려준다
export function updateMockAccount(
  user: AuthUser,
  input: ProfileUpdateInput,
): { user: AuthUser } | { error: ProfileUpdateError } {
  // 내 계정은 바꾸기 전 이메일로 찾고, 바꿀 이메일을 다른 계정이 쓰고 있으면 막는다
  if (
    MOCK_ACCOUNTS.some(
      (candidate) => candidate.email !== user.email && candidate.email === input.email,
    )
  ) {
    return { error: 'duplicate-email' };
  }

  const { password, ...profile } = input;
  const account = MOCK_ACCOUNTS.find((candidate) => candidate.email === user.email);
  if (account) Object.assign(account, profile, password ? { password } : {});

  // 비밀번호는 로그인 상태(sessionStorage)에 남기지 않는다
  return { user: { ...user, ...profile } };
}
