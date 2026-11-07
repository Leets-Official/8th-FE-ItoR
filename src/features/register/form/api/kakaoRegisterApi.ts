import { apiClient } from '@/shared/api/apiClient';
import type { ApiResponse } from '@/shared/api/apiTypes';

import type { OAuthRegisterRequest } from '../model/kakaoRegistration';

type RegisterPostResponse = {
  email: string;
  nickname: string;
  profilePicture: string | null;
  introduction: string | null;
};

export async function postOAuthRegister(oAuthRegisterRequest: OAuthRegisterRequest) {
  const response = await apiClient.post<ApiResponse<RegisterPostResponse>>(
    '/auth/register-oauth',
    oAuthRegisterRequest,
  );
  return response.data.data;
}
