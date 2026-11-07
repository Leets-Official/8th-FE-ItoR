import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';

import { clearStoredAuth, readStoredAuth, updateStoredTokens } from './authStorage';
import type { ApiResponse } from './apiTypes';

type RetryableRequest = InternalAxiosRequestConfig & { _retry?: boolean };
type AccessTokenReissuePostResponse = {
  accessToken: string;
  refreshToken: string;
};

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'https://blog.leets.land';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

let reissuePromise: Promise<AccessTokenReissuePostResponse> | null = null;

apiClient.interceptors.request.use((config) => {
  const accessToken = readStoredAuth()?.accessToken;

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const request = error.config as RetryableRequest | undefined;
    const storedAuth = readStoredAuth();
    const cannotReissue =
      error.response?.status !== 401 ||
      !request ||
      request._retry ||
      request.url?.startsWith('/auth/');

    if (cannotReissue || !storedAuth?.refreshToken) {
      return Promise.reject(error);
    }

    request._retry = true;

    try {
      reissuePromise ??= axios
        .post<ApiResponse<AccessTokenReissuePostResponse>>(`${API_BASE_URL}/auth/reissue`, {
          refreshToken: storedAuth.refreshToken,
        })
        .then((response) => response.data.data)
        .finally(() => {
          reissuePromise = null;
        });

      const tokens = await reissuePromise;
      updateStoredTokens(tokens.accessToken, tokens.refreshToken);
      request.headers.Authorization = `Bearer ${tokens.accessToken}`;
      return apiClient(request);
    } catch (reissueError) {
      clearStoredAuth();
      return Promise.reject(reissueError);
    }
  },
);

export function getApiErrorMessage(error: unknown, fallbackMessage: string) {
  if (axios.isAxiosError(error)) {
    const response = error.response?.data as { message?: string } | undefined;
    return response?.message ?? fallbackMessage;
  }

  return fallbackMessage;
}
