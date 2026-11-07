import { apiClient } from '@/shared/api/apiClient';
import type { ApiResponse } from '@/shared/api/apiTypes';

export type RegisterPostRequest = {
  email: string;
  nickname: string;
  password: string;
  profilePicture: string;
  birthDate: string;
  name: string;
  introduction: string;
};

type RegisterPostResponse = {
  email: string;
  nickname: string;
  profilePicture: string | null;
  introduction: string | null;
};

export async function postRegister(registerPostRequest: RegisterPostRequest) {
  const response = await apiClient.post<ApiResponse<RegisterPostResponse>>(
    '/auth/register',
    registerPostRequest,
  );
  return response.data.data;
}
