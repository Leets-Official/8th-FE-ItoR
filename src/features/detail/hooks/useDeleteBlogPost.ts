import { useNavigate } from '@tanstack/react-router';

import { useToast } from '@/shared/ui/toast/hooks/useToast';

/** @returns 게시글 삭제 성공 후 메인 페이지 이동과 완료 토스트를 처리하는 함수 */
export function useDeleteBlogPost() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  async function deleteBlogPost() {
    // TODO(API): 게시글 삭제 요청이 성공한 경우에만 메인 이동과 완료 토스트를 실행합니다.
    await navigate({ to: '/' });
    showToast({ variant: 'positive', message: '삭제되었습니다!' });
  }

  return { deleteBlogPost };
}
