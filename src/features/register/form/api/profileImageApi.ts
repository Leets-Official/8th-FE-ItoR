import { uploadImage } from '@/shared/api/imageUpload';

/** Pre-Signed URL을 발급받아 프로필 이미지를 업로드하고 저장할 이미지 URL을 반환합니다. */
export async function uploadProfileImage(file: File) {
  return uploadImage(file);
}
