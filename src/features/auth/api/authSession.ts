import axios, { type InternalAxiosRequestConfig } from 'axios';

import { api } from '@/shared/apis/client';
import {
  clearAuthSession,
  getAccessToken,
  getAuthSnapshot,
  getRefreshToken,
  isAccessTokenExpired,
  saveAuthTokens,
} from '@/shared/apis/tokenSession';

import { authApi } from './authApi';

let reissue: Promise<string> | null = null;
let reissueRevision = -1;

export function refreshAuthSession() {
  if (reissue && reissueRevision === getAuthSnapshot().revision) return reissue;
  const refreshToken = getRefreshToken();
  if (!refreshToken) return Promise.reject(new Error('다시 로그인해주세요.'));
  const { revision, method } = getAuthSnapshot();
  reissueRevision = revision;
  const pending = authApi
    .reissue(refreshToken)
    .then(({ data }) => {
      if (getAuthSnapshot().revision !== revision) throw new Error('로그인 상태가 변경되었습니다.');
      saveAuthTokens(data, method);
      return data.accessToken;
    })
    .catch((error: unknown) => {
      if (getAuthSnapshot().revision === revision) clearAuthSession();
      throw error;
    })
    .finally(() => {
      if (reissue === pending) reissue = null;
    });
  reissue = pending;
  return pending;
}

function isProtectedBackendRequest(config: InternalAxiosRequestConfig) {
  if (!config.url || !api.defaults.baseURL) return false;
  const backend = new URL(api.defaults.baseURL, window.location.origin);
  const base = new URL(config.baseURL ?? api.defaults.baseURL, window.location.origin);
  const url = new URL(config.url, base);
  return url.origin === backend.origin && !/^\/auth\//.test(url.pathname);
}

api.interceptors.request.use(async (config) => {
  if (!isProtectedBackendRequest(config) || !getAuthSnapshot().hasSession) return config;
  let token = getAccessToken();
  if (!token || isAccessTokenExpired(token)) token = await refreshAuthSession();
  config.headers.set('Authorization', `Bearer ${token}`);
  return config;
});

api.interceptors.response.use(undefined, async (error: unknown) => {
  if (!axios.isAxiosError(error) || error.response?.status !== 401 || !error.config) {
    return Promise.reject(error);
  }
  const config = error.config as InternalAxiosRequestConfig & { authRetried?: boolean };
  const token = getAccessToken();
  if (
    !isProtectedBackendRequest(config) ||
    !token ||
    config.headers.get('Authorization') !== `Bearer ${token}`
  )
    return Promise.reject(error);
  // JWT가 실제로 만료된 경우만 재발급한다. 로그인 실패·권한 오류는 재발급하지 않는다.
  if (!config.authRetried && isAccessTokenExpired(token)) {
    config.authRetried = true;
    const renewed = await refreshAuthSession();
    config.headers.set('Authorization', `Bearer ${renewed}`);
    return api(config);
  }
  clearAuthSession();
  return Promise.reject(error);
});
