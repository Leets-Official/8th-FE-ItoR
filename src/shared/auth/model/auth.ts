import type { StoredAuth } from '@/shared/api/authStorage';

export type LoginPostRequest = {
  email: string;
  password: string;
};

export type LoginPostResponse = StoredAuth & {
  httpStatus: string;
  responseMessage: string;
};

export type OAuthRegisterRequiredResponse = {
  nickname: string;
  picture: string | null;
  kakaoId: number;
  httpStatus: string;
  responseMessage: string;
};

export type OAuthLoginResponse = LoginPostResponse | OAuthRegisterRequiredResponse;

export function isLoginPostResponse(response: OAuthLoginResponse): response is LoginPostResponse {
  return 'accessToken' in response && 'refreshToken' in response;
}
