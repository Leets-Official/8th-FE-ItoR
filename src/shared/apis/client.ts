import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || undefined,
});

api.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (axios.isAxiosError(error) && !error.response && error.code !== 'ERR_CANCELED') {
      return Promise.reject(
        new Error('서버에 연결할 수 없습니다. 잠시 후 다시 시도해 주세요.', { cause: error }),
      );
    }

    return Promise.reject(error);
  },
);
