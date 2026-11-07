import axios from 'axios';

import { apiClient } from './apiClient';
import type { ApiResponse } from './apiTypes';

function createUploadFileName(fileName: string) {
  return `${crypto.randomUUID()}-${fileName.replaceAll(' ', '-')}`;
}

function removeQueryString(url: string) {
  const uploadedImageUrl = new URL(url);
  uploadedImageUrl.search = '';
  return uploadedImageUrl.toString();
}

/** Pre-Signed URL을 발급받아 파일을 업로드하고 저장할 이미지 URL을 반환합니다. */
export async function uploadImage(file: File) {
  const response = await apiClient.get<ApiResponse<string>>('/images/presigned-url', {
    params: { fileName: createUploadFileName(file.name) },
  });
  const presignedUrl = response.data.data;

  await axios.put(presignedUrl, file, {
    headers: { 'Content-Type': file.type },
  });

  return removeQueryString(presignedUrl);
}
