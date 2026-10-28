import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createPost, deletePost, updatePost } from './postApi';

export const postQueryKeys = {
  all: ['posts'] as const,
  list: (page: number, size: number) => ['posts', 'list', page, size] as const,
  // 사용자 페이지에서 거를 전체 글 목록
  everything: ['posts', 'list', 'all'] as const,
  // 로그인한 사용자에 따라 내 글인지(isOwner)가 달라져 보는 사람도 키에 넣는다
  detail: (postId: string, viewerNickname?: string) => ['posts', postId, viewerNickname] as const,
};

// 작성·수정·삭제가 성공하면 목록·상세가 모두 바뀌므로 게시글 쿼리를 통째로 무효화한다
export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPost,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: postQueryKeys.all }),
  });
}

export function useUpdatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updatePost,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: postQueryKeys.all }),
  });
}

export function useDeletePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePost,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: postQueryKeys.all }),
  });
}
