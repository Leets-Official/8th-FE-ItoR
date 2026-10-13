import axios from 'axios';

import type { ApiResponse } from '@/shared/types/api';

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function getApiErrorMessage(
  error: unknown,
  fallback = '요청을 처리할 수 없습니다. 다시 시도해주세요.',
) {
  if (axios.isAxiosError(error)) {
    if (isRecord(error.response?.data)) {
      const message = error.response.data.message;
      if (typeof message === 'string' && message) return message;
    }
    return fallback;
  }
  return error instanceof Error ? error.message : fallback;
}

export function readApiResponse<T>(
  value: unknown,
  isData: (data: unknown) => data is T,
): ApiResponse<T> {
  if (!isRecord(value)) throw new Error('서버 응답 형식을 확인할 수 없습니다.');
  const { code, message, data } = value;
  if (
    typeof code !== 'number' ||
    typeof message !== 'string' ||
    (code >= 400 && code <= 599) ||
    !isData(data)
  ) {
    throw new Error(
      typeof message === 'string' && message ? message : '서버 응답 형식을 확인할 수 없습니다.',
    );
  }
  return { code, message, data };
}
