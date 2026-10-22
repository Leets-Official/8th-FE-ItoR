import { useMutation, useQueryClient } from '@tanstack/react-query';

import { postQueries } from '@/features/posts/api/postQueries';
import { getAuthSnapshot } from '@/shared/apis/tokenSession';

import type { PostComment } from '../model/comment';
import { commentsApi } from './commentsApi';

function requireSession(postId: string | undefined) {
  const session = getAuthSnapshot();
  if (!session.hasSession) throw new Error('로그인이 필요합니다.');
  if (!postId) throw new Error('게시글을 찾을 수 없습니다.');
  return { postId, session };
}

function requireContent(content: string) {
  const trimmed = content.trim();
  if (!trimmed) throw new Error('댓글 내용을 입력해주세요.');
  return trimmed;
}

export function useCommentMutations(postId: string | undefined) {
  const queryClient = useQueryClient();
  const invalidatePosts = () => queryClient.invalidateQueries({ queryKey: postQueries.all });

  function requireOwnedComment(id: string) {
    const { postId: currentPostId, session } = requireSession(postId);
    const detail = queryClient.getQueryData<{ comments: PostComment[] }>(
      postQueries.detail(currentPostId, session.hasSession, session.revision),
    );
    if (!detail?.comments.some((comment) => comment.id === id && comment.isOwner)) {
      throw new Error('작성자만 댓글을 수정하거나 삭제할 수 있습니다.');
    }
    const commentId = Number(id);
    if (!/^\d+$/.test(id) || !Number.isSafeInteger(commentId)) {
      throw new Error('올바른 댓글 ID가 아닙니다.');
    }
    return commentId;
  }

  const create = useMutation({
    mutationKey: ['comments', postId, 'create'],
    mutationFn: async (content: string) => {
      const { postId: currentPostId } = requireSession(postId);
      const response = await commentsApi.create(currentPostId, requireContent(content));
      return response.data;
    },
    onSuccess: invalidatePosts,
    retry: false,
  });

  const update = useMutation({
    mutationKey: ['comments', postId, 'update'],
    mutationFn: async ({ id, content }: { id: string; content: string }) => {
      const commentId = requireOwnedComment(id);
      const response = await commentsApi.update(commentId, requireContent(content));
      return response.data;
    },
    onSuccess: invalidatePosts,
    retry: false,
  });

  const remove = useMutation({
    mutationKey: ['comments', postId, 'delete'],
    mutationFn: async (id: string) => {
      const commentId = requireOwnedComment(id);
      const response = await commentsApi.delete(commentId);
      return response.data;
    },
    onSuccess: invalidatePosts,
    retry: false,
  });

  return { create, update, remove };
}
