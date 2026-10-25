import { getPostPage as requestPostPage } from '@/shared/api/postApi';

const API_PAGE_SIZE = 10;

async function getPostPage(page: number, signal?: AbortSignal) {
  return requestPostPage({
    page,
    size: API_PAGE_SIZE,
    authenticated: true,
    signal,
  });
}

/** 로그인한 상태로 전체 게시글을 조회해 작성자별 목록 구성에 필요한 원본을 반환합니다. */
export async function getAuthenticatedPosts(signal?: AbortSignal) {
  const firstPage = await getPostPage(1, signal);
  const pageMax = Math.max(firstPage.pageMax ?? 1, 1);
  const remainingPages = await Promise.all(
    Array.from({ length: pageMax - 1 }, (_, index) => getPostPage(index + 2, signal)),
  );

  return [firstPage, ...remainingPages].flatMap((page) => page.posts ?? []);
}
