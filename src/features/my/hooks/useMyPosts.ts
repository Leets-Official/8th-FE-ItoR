import { useEffect, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import { useAuth } from '@/shared/auth/hooks/useAuth';
import { postQueryKeys } from '@/shared/api/postQueryKeys';

import { getAuthenticatedPosts } from '../api/myPostApi';
import { getMe } from '../api/userApi';
import { userQueryKeys } from '../api/userQueryKeys';
import { createMyPost } from '../model/my';

const POSTS_PER_PAGE = 5;
const TIME_UPDATE_INTERVAL = 60 * 1000;

/** 로그인한 사용자의 게시글 조회와 5개 단위 페이지네이션 상태를 관리합니다. */
export function useMyPosts() {
  const { auth } = useAuth();
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);
  const [currentTime, setCurrentTime] = useState(() => new Date());
  const hasAccessToken = Boolean(auth?.accessToken);
  const postsQuery = useQuery({
    queryKey: postQueryKeys.my(auth?.nickname),
    queryFn: async ({ signal }) => {
      const [user, posts] = await Promise.all([
        queryClient.ensureQueryData({ queryKey: userQueryKeys.me(), queryFn: getMe }),
        getAuthenticatedPosts(signal),
      ]);
      return posts.filter((post) => post.nickName === user.nickname).map(createMyPost);
    },
    enabled: hasAccessToken,
  });
  const posts = postsQuery.data ?? [];
  const totalPages = Math.max(Math.ceil(posts.length / POSTS_PER_PAGE), 1);
  const firstPostIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const visiblePosts = posts.slice(firstPostIndex, firstPostIndex + POSTS_PER_PAGE);

  useEffect(() => {
    const intervalId = window.setInterval(() => setCurrentTime(new Date()), TIME_UPDATE_INTERVAL);
    return () => window.clearInterval(intervalId);
  }, []);

  function retry() {
    void postsQuery.refetch();
  }

  return {
    posts: visiblePosts,
    currentPage,
    totalPages,
    currentTime,
    isLoading: postsQuery.isPending && hasAccessToken,
    canRetry: hasAccessToken && postsQuery.isError,
    errorMessage: hasAccessToken
      ? postsQuery.isError
        ? '작성한 게시물을 불러오지 못했습니다.'
        : ''
      : '로그인이 필요합니다.',
    changePage: setCurrentPage,
    retry,
  };
}
