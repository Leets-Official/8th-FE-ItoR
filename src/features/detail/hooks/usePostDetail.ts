import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { getApiErrorMessage } from '@/shared/api/apiClient';
import { postQueryKeys } from '@/shared/api/postQueryKeys';
import { useAuth } from '@/shared/auth/hooks/useAuth';

import { deleteComment, getPost, patchComment, postComment } from '../api/detailApi';

const TIME_UPDATE_INTERVAL = 60 * 1000;

/** 게시글 상세 서버 상태와 댓글 작성·수정·삭제 요청을 관리합니다. */
export function usePostDetail(postId: string) {
  const { auth } = useAuth();
  const queryClient = useQueryClient();
  const [currentTime, setCurrentTime] = useState(() => new Date());
  const [actionErrorMessage, setActionErrorMessage] = useState('');
  const hasAccessToken = Boolean(auth?.accessToken);
  const postQuery = useQuery({
    queryKey: postQueryKeys.detail(postId, auth?.nickname ?? null),
    queryFn: ({ signal }) => getPost(postId, hasAccessToken, signal),
  });

  async function refreshPost() {
    await queryClient.invalidateQueries({ queryKey: postQueryKeys.detailRoot(postId) });
    setCurrentTime(new Date());
  }

  const createCommentMutation = useMutation({
    mutationFn: (content: string) => postComment(postId, { content }),
    onSuccess: refreshPost,
  });
  const updateCommentMutation = useMutation({
    mutationFn: ({ commentId, content }: { commentId: number; content: string }) =>
      patchComment(commentId, { content }),
    onSuccess: refreshPost,
  });
  const deleteCommentMutation = useMutation({
    mutationFn: deleteComment,
    onSuccess: refreshPost,
  });

  useEffect(() => {
    const intervalId = window.setInterval(() => setCurrentTime(new Date()), TIME_UPDATE_INTERVAL);
    return () => window.clearInterval(intervalId);
  }, []);

  async function createComment(content: string) {
    setActionErrorMessage('');

    try {
      await createCommentMutation.mutateAsync(content);
      return true;
    } catch (error) {
      setActionErrorMessage(getApiErrorMessage(error, '댓글을 등록하지 못했습니다.'));
      return false;
    }
  }

  async function updateComment(commentId: number, content: string) {
    setActionErrorMessage('');

    try {
      await updateCommentMutation.mutateAsync({ commentId, content });
      return true;
    } catch (error) {
      setActionErrorMessage(getApiErrorMessage(error, '댓글을 수정하지 못했습니다.'));
      return false;
    }
  }

  async function removeComment(commentId: number) {
    setActionErrorMessage('');

    try {
      await deleteCommentMutation.mutateAsync(commentId);
    } catch (error) {
      setActionErrorMessage(getApiErrorMessage(error, '댓글을 삭제하지 못했습니다.'));
    }
  }

  function retry() {
    void postQuery.refetch();
  }

  const queryErrorMessage = postQuery.isError
    ? getApiErrorMessage(postQuery.error, '게시글을 불러오지 못했습니다.')
    : '';

  return {
    auth,
    postReadResponse: postQuery.data ?? null,
    currentTime,
    isLoading: postQuery.isPending,
    isCommentPending:
      createCommentMutation.isPending ||
      updateCommentMutation.isPending ||
      deleteCommentMutation.isPending,
    errorMessage: actionErrorMessage || queryErrorMessage,
    createComment,
    updateComment,
    removeComment,
    retry,
  };
}
