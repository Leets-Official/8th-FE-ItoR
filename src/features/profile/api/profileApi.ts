import { api } from '@/shared/apis/client';
import { isRecord, readApiResponse } from '@/shared/apis/response';

import type { UserResponse } from '../model/userResponse';

function isUserResponse(value: unknown): value is UserResponse {
  return (
    isRecord(value) &&
    typeof value.id === 'number' &&
    Number.isSafeInteger(value.id) &&
    typeof value.email === 'string' &&
    typeof value.nickname === 'string' &&
    typeof value.name === 'string' &&
    typeof value.birthDate === 'string' &&
    (value.profilePicture == null || typeof value.profilePicture === 'string') &&
    (value.introduction == null || typeof value.introduction === 'string')
  );
}

export const profileApi = {
  getMe: async (signal?: AbortSignal) => {
    const response = await api.get<unknown>('/users/me', { signal });
    return readApiResponse(response.data, isUserResponse);
  },
};
