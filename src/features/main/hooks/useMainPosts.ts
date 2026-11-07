import { useEffect, useState } from 'react';
import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { useAuth } from '@/shared/auth/hooks/useAuth';
import { postQueryKeys } from '@/shared/api/postQueryKeys';

import { getMainPosts } from '../api/mainPostApi';
import { createMainPost } from '../model/post';

const TIME_UPDATE_INTERVAL = 60 * 1000;

/** 메인 게시물 목록의 서버 캐시, 페이지 이동과 시간 갱신 상태를 관리합니다. */
export function useMainPosts() {
  const { auth } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [currentTime, setCurrentTime] = useState(() => new Date());
  const hasAccessToken = Boolean(auth?.accessToken);
  const postsQuery = useQuery({
    queryKey: postQueryKeys.main(currentPage, hasAccessToken),
    queryFn: ({ signal }) => getMainPosts(currentPage, hasAccessToken, signal),
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    const intervalId = window.setInterval(() => setCurrentTime(new Date()), TIME_UPDATE_INTERVAL);
    return () => window.clearInterval(intervalId);
  }, []);

  function retry() {
    void postsQuery.refetch();
  }

  return {
    posts: (postsQuery.data?.posts ?? []).map(createMainPost),
    currentPage,
    totalPages: Math.max(postsQuery.data?.pageMax ?? 0, 1),
    currentTime,
    isLoading: postsQuery.isPending,
    errorMessage: postsQuery.isError ? '게시물을 불러오지 못했습니다.' : '',
    changePage: setCurrentPage,
    retry,
  };
}
