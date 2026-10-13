import { api } from '@/shared/apis/client';
import { isRecord, readApiResponse } from '@/shared/apis/response';

import type {
  AuthTokens,
  KakaoAuthResponse,
  LoginResponse,
  RegisterBody,
  RegisterResponse,
} from '../model/auth';
import type { LoginCredentials } from '../model/login';

export function isAuthTokens(value: unknown): value is AuthTokens {
  return (
    isRecord(value) &&
    typeof value.accessToken === 'string' &&
    Boolean(value.accessToken) &&
    typeof value.refreshToken === 'string' &&
    Boolean(value.refreshToken)
  );
}

function isLoginResponse(value: unknown): value is LoginResponse {
  return (
    isAuthTokens(value) &&
    isRecord(value) &&
    typeof value.nickname === 'string' &&
    !(typeof value.httpStatus === 'string' && /^[45]\d\d\b/.test(value.httpStatus))
  );
}

function isRegisterResponse(value: unknown): value is RegisterResponse {
  return (
    isRecord(value) &&
    typeof value.email === 'string' &&
    Boolean(value.email) &&
    typeof value.nickname === 'string' &&
    Boolean(value.nickname)
  );
}

function isKakaoAuthResponse(value: unknown): value is KakaoAuthResponse {
  return (
    isRecord(value) &&
    typeof value.httpStatus === 'string' &&
    typeof value.responseMessage === 'string'
  );
}

export const authApi = {
  kakaoRedirect: async (code: string) => {
    if (!code.trim()) throw new Error('카카오 인증 코드가 없습니다. 다시 인증해주세요.');
    const response = await api.get<unknown>('/auth/kakao/redirect', { params: { code } });
    const body = readApiResponse(response.data, isKakaoAuthResponse);
    if (!/^2\d\d(?:\s|$)/.test(body.data.httpStatus)) {
      throw new Error(body.data.responseMessage || '카카오 인증을 완료하지 못했습니다.');
    }
    return body;
  },
  login: async (body: LoginCredentials) => {
    const response = await api.post<unknown>('/auth/login', body);
    return readApiResponse(response.data, isLoginResponse);
  },
  register: async (body: RegisterBody) => {
    const response = await api.post<unknown>('/auth/register', body);
    return readApiResponse(response.data, isRegisterResponse);
  },
  reissue: async (refreshToken: string) => {
    const response = await api.post<unknown>('/auth/reissue', { refreshToken });
    return readApiResponse(response.data, isAuthTokens);
  },
};
