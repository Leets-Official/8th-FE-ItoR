import { useSearchParams } from 'react-router';

/**
 * 현재 페이지 번호를 URL(?page=2)에 저장한다.
 * 새로고침하거나 뒤로 가기를 해도 보던 페이지가 유지된다.
 */
export const usePageParam = (totalPages: number) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const requestedPage = Number(searchParams.get('page')) || 1;
  const currentPage = Math.min(Math.max(requestedPage, 1), Math.max(totalPages, 1));

  const changePage = (page: number) => {
    setSearchParams(page === 1 ? {} : { page: String(page) });
    window.scrollTo({ top: 0 });
  };

  return { currentPage, changePage };
};
