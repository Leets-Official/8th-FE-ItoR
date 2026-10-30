import { useMutation, useQueryClient } from '@tanstack/react-query';

import { getAuthSnapshot } from '@/shared/apis/tokenSession';

import { createPostBody } from '../lib/createPostBody';
import type { PostDraft } from '../model/postDraft';
import { postQueries } from './postQueries';
import { postsApi } from './postsApi';

function requireSession() {
  const session = getAuthSnapshot();
  if (!session.hasSession) throw new Error('로그인이 필요합니다.');
  return session;
}

function requireSameSession(session: ReturnType<typeof getAuthSnapshot>) {
  if (!getAuthSnapshot().hasSession || getAuthSnapshot().revision !== session.revision) {
    throw new Error('로그인 상태가 변경되었습니다. 다시 시도해주세요.');
  }
}

export function useCreatePostMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: [...postQueries.all, 'create'],
    mutationFn: async (draft: PostDraft) => {
      const session = requireSession();
      const body = createPostBody(draft);
      requireSameSession(session);
      const response = await postsApi.create(body);
      return response.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: postQueries.all }),
    retry: false,
  });
}

export function useUpdatePostMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: [...postQueries.all, 'update'],
    mutationFn: async ({ postId, draft }: { postId: string; draft: PostDraft }) => {
      const session = requireSession();
      const body = createPostBody(draft);
      const detail = queryClient.getQueryData<{ isOwner: boolean }>(
        postQueries.detail(postId, session.hasSession, session.revision),
      );
      requireSameSession(session);
      if (!detail?.isOwner) throw new Error('작성자만 게시글을 수정할 수 있습니다.');
      const response = await postsApi.update(postId, body);
      return response.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: postQueries.all }),
    retry: false,
  });
}

export function useDeletePostMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: [...postQueries.all, 'delete'],
    mutationFn: async (postId: string) => {
      const session = requireSession();
      const detail = queryClient.getQueryData<{ isOwner: boolean }>(
        postQueries.detail(postId, session.hasSession, session.revision),
      );
      requireSameSession(session);
      if (!detail?.isOwner) throw new Error('작성자만 게시글을 삭제할 수 있습니다.');
      const response = await postsApi.delete(postId);
      return response.data;
    },
    onSuccess: async (_data, postId) => {
      await queryClient.cancelQueries({ queryKey: postQueries.all });
      queryClient.removeQueries({ queryKey: [...postQueries.all, 'detail', postId] });
      await queryClient.invalidateQueries({
        queryKey: postQueries.all,
        refetchType: 'none',
      });
    },
    retry: false,
  });
}
