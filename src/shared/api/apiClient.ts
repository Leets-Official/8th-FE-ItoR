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

const reissuePromises = new Map<string, Promise<AccessTokenReissuePostResponse>>();
const refreshedAccessTokens = new Map<string, string>();
const MAX_REFRESHED_TOKEN_HISTORY = 10;

function isRefreshTokenRejected(error: unknown) {
  if (!axios.isAxiosError(error)) {
    return false;
  }

  return error.response?.status === 401;
}

function getRequestAccessToken(request: RetryableRequest) {
  const authorization = request.headers.get('Authorization');

  if (typeof authorization !== 'string' || !authorization.startsWith('Bearer ')) {
    return undefined;
  }

  return authorization.slice('Bearer '.length);
}

function reissueAccessToken(refreshToken: string) {
  const pendingRequest = reissuePromises.get(refreshToken);

  if (pendingRequest) {
    return pendingRequest;
  }

  const reissueRequest = axios
    .post<ApiResponse<AccessTokenReissuePostResponse>>(`${API_BASE_URL}/auth/reissue`, {
      refreshToken,
    })
    .then((response) => response.data.data)
    .finally(() => {
      reissuePromises.delete(refreshToken);
    });
  reissuePromises.set(refreshToken, reissueRequest);
  return reissueRequest;
}

function rememberRefreshedAccessToken(previousAccessToken: string, nextAccessToken: string) {
  refreshedAccessTokens.set(previousAccessToken, nextAccessToken);

  if (refreshedAccessTokens.size > MAX_REFRESHED_TOKEN_HISTORY) {
    const oldestAccessToken = refreshedAccessTokens.keys().next().value;

    if (oldestAccessToken) {
      refreshedAccessTokens.delete(oldestAccessToken);
    }
  }
}

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
      error.response?.status !== 401 || !request || request.url?.startsWith('/auth/');

    if (cannotReissue || !storedAuth?.refreshToken) {
      return Promise.reject(error);
    }

    const requestAccessToken = getRequestAccessToken(request);

    if (requestAccessToken && requestAccessToken !== storedAuth.accessToken) {
      const refreshedAccessToken = refreshedAccessTokens.get(requestAccessToken);

      if (!request._retry && refreshedAccessToken === storedAuth.accessToken) {
        request._retry = true;
        request.headers.Authorization = `Bearer ${storedAuth.accessToken}`;
        return apiClient(request);
      }

      return Promise.reject(error);
    }

    if (request._retry) {
      return Promise.reject(error);
    }

    request._retry = true;
    const reissueRefreshToken = storedAuth.refreshToken;

    try {
      const tokens = await reissueAccessToken(reissueRefreshToken);
      const currentAuth = readStoredAuth();
      const isOriginalSession = currentAuth?.refreshToken === reissueRefreshToken;
      const isAlreadyUpdatedSession =
        currentAuth?.accessToken === tokens.accessToken &&
        currentAuth.refreshToken === tokens.refreshToken;

      if (!isOriginalSession && !isAlreadyUpdatedSession) {
        return Promise.reject(error);
      }

      rememberRefreshedAccessToken(storedAuth.accessToken, tokens.accessToken);

      if (isOriginalSession) {
        updateStoredTokens(tokens.accessToken, tokens.refreshToken);
      }

      request.headers.Authorization = `Bearer ${tokens.accessToken}`;
      return apiClient(request);
    } catch (reissueError) {
      if (
        readStoredAuth()?.refreshToken === reissueRefreshToken &&
        isRefreshTokenRejected(reissueError)
      ) {
        clearStoredAuth();
      }

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
