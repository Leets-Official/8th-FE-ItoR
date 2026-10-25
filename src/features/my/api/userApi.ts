import { apiClient } from '@/shared/api/apiClient';
import type { ApiResponse } from '@/shared/api/apiTypes';

export type UserGetResponse = {
  id: number;
  email: string;
  nickname: string;
  profilePicture: string | null;
  name: string;
  birthDate: string;
  introduction: string | null;
};

export type UserPatchRequest = {
  email: string;
  nickname: string;
  profilePicture: string;
  birthDate: string;
  name: string;
  introduction: string;
};

export type PasswordPatchRequest = {
  password: string;
};

export type NicknamePatchRequest = {
  nickname: string;
};

export type ProfilePicturePatchRequest = {
  profilePicture: string;
};

/** 로그인한 사용자의 프로필 정보를 조회합니다. */
export async function getMe() {
  const response = await apiClient.get<ApiResponse<UserGetResponse>>('/users/me');
  return response.data.data;
}

/** 로그인한 사용자의 기본 프로필 정보를 수정합니다. */
export async function patchUser(userPatchRequest: UserPatchRequest) {
  await apiClient.patch<ApiResponse<unknown>>('/users', userPatchRequest);
}

/** 로그인한 사용자의 비밀번호를 수정합니다. */
export async function patchPassword(passwordPatchRequest: PasswordPatchRequest) {
  await apiClient.patch<ApiResponse<unknown>>('/users/password', passwordPatchRequest);
}

/** 로그인한 사용자의 닉네임만 수정합니다. */
export async function patchNickname(nicknamePatchRequest: NicknamePatchRequest) {
  await apiClient.patch<ApiResponse<unknown>>('/users/nickname', nicknamePatchRequest);
}

/** 로그인한 사용자의 프로필 사진만 수정합니다. */
export async function patchProfilePicture(profilePicturePatchRequest: ProfilePicturePatchRequest) {
  await apiClient.patch<ApiResponse<unknown>>('/users/picture', profilePicturePatchRequest);
}
