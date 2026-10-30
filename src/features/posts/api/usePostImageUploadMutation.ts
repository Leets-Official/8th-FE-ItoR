import { useMutation } from '@tanstack/react-query';

import { getAuthSnapshot } from '@/shared/apis/tokenSession';

import { getUploadedImageUrl } from '../lib/getUploadedImageUrl';
import { postImageApi } from './postImageApi';
import { postQueries } from './postQueries';

export function usePostImageUploadMutation() {
  return useMutation({
    mutationKey: [...postQueries.all, 'uploadImage'],
    mutationFn: async ({ file, signal }: { file: File; signal: AbortSignal }) => {
      const session = getAuthSnapshot();
      if (!session.hasSession) throw new Error('사진을 업로드하려면 로그인이 필요합니다.');

      function requireSameSession() {
        const current = getAuthSnapshot();
        if (!current.hasSession || current.revision !== session.revision) {
          throw new Error('로그인 상태가 변경되었습니다. 사진을 다시 선택해주세요.');
        }
      }

      const { data: presignedUrl } = await postImageApi.getPresignedUrl(file.name, signal);
      const imageUrl = getUploadedImageUrl(presignedUrl);
      requireSameSession();
      try {
        await postImageApi.upload(presignedUrl, file, signal);
      } catch (error) {
        if (signal.aborted) throw error;
        throw new Error('사진 업로드에 실패했습니다. 사진을 다시 선택해주세요.', { cause: error });
      }
      requireSameSession();
      return imageUrl;
    },
    retry: false,
  });
}
