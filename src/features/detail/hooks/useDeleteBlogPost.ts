import { useNavigate } from '@tanstack/react-router';
import { useQueryClient } from '@tanstack/react-query';

import { useToast } from '@/shared/ui/toast/hooks/useToast';
import { postQueryKeys } from '@/shared/api/postQueryKeys';

import { deletePost } from '../api/detailApi';

/** @returns 게시글 삭제 성공 후 메인 페이지 이동과 완료 토스트를 처리하는 함수 */
export function useDeleteBlogPost(postId: string) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  async function deleteBlogPost() {
    await deletePost(postId);
    await queryClient.invalidateQueries({ queryKey: postQueryKeys.all });
    queryClient.removeQueries({ queryKey: postQueryKeys.detailRoot(postId) });
    await navigate({ to: '/' });
    showToast({ variant: 'positive', message: '삭제되었습니다!' });
  }

  return { deleteBlogPost };
}
