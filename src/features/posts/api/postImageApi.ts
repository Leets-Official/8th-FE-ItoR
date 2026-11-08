import axios from 'axios';

import { api } from '@/shared/apis/client';
import { readApiResponse } from '@/shared/apis/response';

// S3 전송에는 백엔드 인증 인터셉터와 쿠키를 사용하지 않는다.
const imageStorage = axios.create({ withCredentials: false });

export const postImageApi = {
  getPresignedUrl: async (fileName: string, signal?: AbortSignal) => {
    const response = await api.get<unknown>('/images/presigned-url', {
      params: { fileName },
      signal,
    });
    return readApiResponse(
      response.data,
      (data): data is string => typeof data === 'string' && Boolean(data.trim()),
    );
  },
  upload: async (url: string, file: File, signal?: AbortSignal) => {
    await imageStorage.put(url, file, {
      signal,
      headers: { 'Content-Type': file.type, Authorization: false },
    });
  },
};
