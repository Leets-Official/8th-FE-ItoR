import { isAxiosError } from 'axios';
import { api, type ApiResponse } from '@/shared/api/instance';
import { clearTokens, saveTokens } from '@/shared/api/tokenStorage';
import type {
  AuthUser,
  KakaoLoginError,
  LoginError,
  ProfileUpdateFailure,
  ProfileUpdateInput,
  SignUpFailure,
  SignUpInput,
} from '../model/types';
import { clearKakaoId, readKakaoId, saveKakaoId } from './kakaoAuth';

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

// 가입된 카카오 계정이면 토큰을, 아니면 회원가입(/auth/register-oauth)에 넘길 kakaoId를 준다
interface KakaoLoginResponse {
  accessToken?: string;
  refreshToken?: string;
  kakaoId?: number;
}

interface MyInfoResponse {
  id: number;
  email: string;
  nickname: string;
  profilePicture?: string | null;
  name: string;
  birthDate: string;
  introduction?: string | null;
}

// 서버는 빈 값을 null이나 빈 문자열로 보내므로 앱에서 쓰는 undefined로 맞춘다
function toAuthUser({
  email,
  nickname,
  profilePicture,
  name,
  birthDate,
  introduction,
}: MyInfoResponse): AuthUser {
  return {
    email,
    nickname,
    name,
    birthDate,
    profileImageUrl: profilePicture || undefined,
    introduction: introduction || undefined,
  };
}

async function getMyInfo() {
  const { data } = await api.get<ApiResponse<MyInfoResponse>>('/users/me');
  return toAuthUser(data.data);
}

// 로그인 응답에는 이름·생년월일이 없어 토큰을 받은 뒤 내 정보를 따로 불러온다
export async function requestLogin(
  email: string,
  password: string,
): Promise<{ user: AuthUser } | { error: LoginError }> {
  try {
    const { data } = await api.post<ApiResponse<LoginResponse>>('/auth/login', {
      email,
      password,
    });
    saveTokens(data.data);
    return { user: await getMyInfo() };
  } catch (error) {
    // 내 정보 조회가 실패하면 로그인되지 않은 상태로 남으므로 받아 둔 토큰도 버린다
    clearTokens();
    // 서버는 가입되지 않은 이메일과 틀린 비밀번호를 구분하지 않고 모두 401로 응답한다
    if (isAxiosError(error) && error.response?.status === 401) {
      return { error: 'invalid-credentials' };
    }
    return { error: 'unknown' };
  }
}

// 카카오가 Redirect URI로 넘겨준 인가 코드를 서버에 보내 로그인한다. 인가 코드는 한 번만 쓸 수 있다
export async function requestKakaoLogin(
  code: string,
): Promise<{ user: AuthUser } | { error: KakaoLoginError }> {
  try {
    const { data } = await api.get<ApiResponse<KakaoLoginResponse>>('/auth/kakao/redirect', {
      params: { code },
    });
    const { accessToken, refreshToken, kakaoId } = data.data;
    if (!accessToken || !refreshToken) {
      if (kakaoId !== undefined) saveKakaoId(kakaoId);
      return { error: 'unregistered' };
    }

    saveTokens({ accessToken, refreshToken });
    return { user: await getMyInfo() };
  } catch {
    clearTokens();
    return { error: 'unknown' };
  }
}

// 가입·프로필 수정 요청이 실패한 이유를 화면에서 쓰는 실패 이유로 바꾼다
function toRequestFailure(error: unknown): SignUpFailure & ProfileUpdateFailure {
  if (!isAxiosError<{ message?: string }>(error)) return { error: 'unknown' };
  if (error.response?.status === 409) return { error: 'duplicate-email' };
  // 서버 검증(닉네임은 영문·숫자만, 비밀번호는 특수문자 포함 등)에 걸리면 어느 조건인지 서버 문구로 알린다
  if (error.response?.status === 400) {
    return { error: 'invalid-input', message: error.response.data?.message };
  }
  return { error: 'unknown' };
}

// 가입 응답에는 토큰이 없어 로그인은 따로 한다 (완료 모달에서 로그인하기로 이어진다)
export async function registerWithEmail({
  email,
  password,
  name,
  birthDate,
  nickname,
  introduction,
  profileImageUrl,
}: SignUpInput): Promise<SignUpFailure | undefined> {
  try {
    await api.post('/auth/register', {
      email,
      password,
      name,
      birthDate,
      nickname,
      introduction,
      profilePicture: profileImageUrl,
    });
    return undefined;
  } catch (error) {
    return toRequestFailure(error);
  }
}

// 서버가 프로필과 비밀번호를 한 요청으로 처리하지 못한다. 중복 이메일처럼 흔한 실패에서 비밀번호만 바뀌지 않도록 프로필을 먼저 저장한다
export async function updateMyProfile({
  password,
  ...profile
}: ProfileUpdateInput): Promise<
  { user: AuthUser; passwordFailure?: ProfileUpdateFailure } | ProfileUpdateFailure
> {
  const { profileImageUrl, ...fields } = profile;
  try {
    await api.patch('/users', { ...fields, profilePicture: profileImageUrl });
  } catch (error) {
    return toRequestFailure(error);
  }

  // 여기부터는 프로필이 이미 저장됐으므로 실패해도 저장된 내용은 화면에 반영한다
  let passwordFailure: ProfileUpdateFailure | undefined;
  if (password) {
    try {
      await api.patch('/users/password', { password });
    } catch (error) {
      passwordFailure = { error: 'password-not-saved', message: toRequestFailure(error).message };
    }
  }

  // 바뀐 값은 서버 기준으로 다시 불러오되, 조회만 실패하면 입력한 값으로 맞춘다
  const user = await getMyInfo().catch(() => profile);
  return { user, passwordFailure };
}

// 카카오 가입은 비밀번호 대신 카카오 로그인 때 받은 kakaoId로 계정을 연결한다. 가입 응답에는 토큰이 없어 로그인은 따로 한다
export async function registerWithKakao({
  email,
  name,
  birthDate,
  nickname,
  introduction,
  profileImageUrl,
}: SignUpInput): Promise<SignUpFailure | undefined> {
  const kakaoId = readKakaoId();
  if (kakaoId === undefined) return { error: 'kakao-auth-required' };

  try {
    await api.post('/auth/register-oauth', {
      kakaoId,
      email,
      name,
      birthDate,
      nickname,
      introduction,
      profilePicture: profileImageUrl,
    });
    clearKakaoId();
    return undefined;
  } catch (error) {
    return toRequestFailure(error);
  }
}
