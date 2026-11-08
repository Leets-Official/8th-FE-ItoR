import { useMutation } from '@tanstack/react-query';
import { createComment, deleteComment } from './commentApi';

// 댓글 목록은 게시글 상세 응답에 담겨 와서, 등록·삭제 후 다시 불러올 쿼리는 사용하는 쪽(페이지)이 정한다
// comment가 post 쿼리 키를 알면 post → comment와 순환 import가 생긴다
// onSuccess가 무효화 Promise를 돌려주면 목록을 다시 받아 올 때까지 mutation이 pending으로 남는다
type CommentChangeHandler = () => Promise<unknown> | void;

export function useCreateComment(onCommentChange?: CommentChangeHandler) {
  return useMutation({
    mutationFn: createComment,
    onSuccess: () => onCommentChange?.(),
  });
}

export function useDeleteComment(onCommentChange?: CommentChangeHandler) {
  return useMutation({
    mutationFn: deleteComment,
    onSuccess: () => onCommentChange?.(),
  });
}
