import { useSyncExternalStore } from 'react';

import { useQuery } from '@tanstack/react-query';

import { getAuthSnapshot, subscribeAuthSession } from '@/shared/apis/tokenSession';

import { mapPostDetail, mapPostSummary } from '../lib/mapPostResponse';
import type { PostListParams } from '../model/postResponse';
import { postQueries } from './postQueries';
import { postsApi } from './postsApi';

type PostSession = ReturnType<typeof getAuthSnapshot>;

export function postListQueryOptions(params: PostListParams, session: PostSession) {
  return {
    queryKey: postQueries.list(params, session.hasSession, session.revision),
    queryFn: async ({ signal }: { signal: AbortSignal }) => {
      const { data } = await postsApi.getList(params, session.hasSession, signal);
      return { posts: data.posts.map(mapPostSummary), totalPages: data.pageMax };
    },
    retry: false,
  };
}

export function postDetailQueryOptions(postId: string, session: PostSession) {
  return {
    queryKey: postQueries.detail(postId, session.hasSession, session.revision),
    queryFn: async ({ signal }: { signal: AbortSignal }) => {
      const { data } = await postsApi.getDetail(postId, session.hasSession, signal);
      return mapPostDetail(data);
    },
    retry: false,
  };
}

export function usePostListQuery(params: PostListParams, enabled = true) {
  const session = useSyncExternalStore(subscribeAuthSession, getAuthSnapshot);
  return useQuery({ ...postListQueryOptions(params, session), enabled });
}

export function usePostDetailQuery(postId: string | undefined, enabled = true) {
  const session = useSyncExternalStore(subscribeAuthSession, getAuthSnapshot);
  return useQuery({
    ...postDetailQueryOptions(postId ?? '', session),
    enabled: enabled && Boolean(postId),
  });
}
