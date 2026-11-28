import axios from 'axios';

import { getAuthSnapshot } from '@/shared/apis/tokenSession';

import type { Post } from '../model/post';
import { POSTS_PER_PAGE } from '../model/post';
import type { PostSummaryResponse } from '../model/postResponse';
import { mapPostSummary } from '../lib/mapPostResponse';
import { postsApi } from './postsApi';

export interface MyPostsCursor {
  nextPage: number;
  pageMax: number;
  pending: PostSummaryResponse[];
  visitedIds: string[];
}

export async function getMyPosts(revision: number, cursor: MyPostsCursor, signal?: AbortSignal) {
  const requireSession = () => {
    if (signal?.aborted) throw new DOMException('조회가 취소되었습니다.', 'AbortError');
    const session = getAuthSnapshot();
    if (!session.hasSession || session.revision !== revision) {
      throw new Error('로그인 상태가 변경되었습니다. 다시 로그인해주세요.');
    }
  };
  const posts: Post[] = [];
  const visited = new Set(cursor.visitedIds);
  let { nextPage, pageMax, pending } = cursor;

  while (posts.length < POSTS_PER_PAGE && (pending.length > 0 || nextPage <= pageMax)) {
    requireSession();
    if (pending.length === 0) {
      const { data } = await postsApi.getList(
        { page: nextPage, size: POSTS_PER_PAGE },
        true,
        signal,
      );
      requireSession();
      nextPage++;
      pageMax = data.pageMax;
      pending = data.posts.filter(({ postId }) => {
        if (visited.has(postId)) return false;
        visited.add(postId);
        return true;
      });
      continue;
    }

    const batchSize = Math.min(4, POSTS_PER_PAGE - posts.length);
    const group = await Promise.allSettled(
      pending.slice(0, batchSize).map(async (summary) => {
        try {
          const { data: detail } = await postsApi.getDetail(summary.postId, true, signal);
          requireSession();
          return detail.isOwner ? mapPostSummary(summary) : null;
        } catch (error) {
          if (axios.isAxiosError(error) && error.response?.status === 404) {
            requireSession();
            return null;
          }
          throw error;
        }
      }),
    );
    for (const result of group) {
      if (result.status === 'rejected') throw result.reason;
      if (result.value) posts.push(result.value);
    }
    pending = pending.slice(batchSize);
  }

  requireSession();
  const nextCursor =
    pending.length > 0 || nextPage <= pageMax
      ? { nextPage, pageMax, pending, visitedIds: [...visited] }
      : undefined;
  return { posts, nextCursor };
}
