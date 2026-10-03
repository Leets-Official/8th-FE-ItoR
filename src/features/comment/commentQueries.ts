import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createComment, deleteComment } from './commentApi';

export const commentQueryKeys = {
  list: (postId: number) => ['posts', postId, 'comments'] as const,
};

// 등록·삭제가 성공하면 댓글 목록 쿼리를 무효화해 서버(목업) 데이터로 다시 불러온다
export function useCreateComment(postId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createComment,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: commentQueryKeys.list(postId) }),
  });
}

export function useDeleteComment(postId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteComment,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: commentQueryKeys.list(postId) }),
  });
}
