import axios from 'axios';
import { api, type ApiResponse } from './instance';

// 서버가 발급한 presigned URL로 S3에 바로 올리고, 서명 쿼리를 뗀 주소를 이미지 URL로 돌려준다
export async function uploadImage(file: File) {
  // presigned URL은 5분 뒤 만료되므로 올리기 직전에 받는다. 서버는 파일 이름에서 확장자만 쓴다
  const { data } = await api.get<ApiResponse<string>>('/images/presigned-url', {
    params: { fileName: file.name },
  });
  const presignedUrl = data.data;

  // 공용 인스턴스의 baseURL·JSON 헤더·Authorization이 붙으면 S3 서명이 맞지 않아 기본 axios로 보낸다
  await axios.put(presignedUrl, file, { headers: { 'Content-Type': file.type } });
  return presignedUrl.split('?')[0];
}
