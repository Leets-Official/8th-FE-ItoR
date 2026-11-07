import { API_BASE_URL, apiClient } from '@/shared/api/apiClient';
import type { ApiResponse } from '@/shared/api/apiTypes';

import type { LoginPostRequest, LoginPostResponse, OAuthLoginResponse } from '../model/auth';

export async function postLogin(loginPostRequest: LoginPostRequest) {
  const response = await apiClient.post<ApiResponse<LoginPostResponse>>(
    '/auth/login',
    loginPostRequest,
  );
  return response.data.data;
}

export function getKakaoLoginUrl() {
  return `${API_BASE_URL}/auth/kakao`;
}

export async function getOAuthLoginRedirect(code: string) {
  const response = await apiClient.get<ApiResponse<OAuthLoginResponse>>('/auth/kakao/redirect', {
    params: { code },
  });
  return response.data.data;
}
