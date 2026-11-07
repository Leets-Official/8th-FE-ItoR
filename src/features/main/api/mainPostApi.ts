import { getPostPage } from '@/shared/api/postApi';

const POSTS_PER_PAGE = 10;

/** 로그인 여부에 맞는 게시물 목록 한 페이지를 조회합니다. */
export async function getMainPosts(page: number, hasAccessToken: boolean, signal?: AbortSignal) {
  return getPostPage({
    page,
    size: POSTS_PER_PAGE,
    authenticated: hasAccessToken,
    signal,
  });
}
