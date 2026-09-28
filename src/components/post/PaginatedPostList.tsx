import Pagination from '@/components/common/Pagination';
import { POSTS_PER_PAGE } from '@/constants/pagination';
import { usePageParam } from '@/hooks/usePageParam';
import type { PostSummary } from '@/types/post';
import { getTotalPages, paginate } from '@/utils/paginate';
import PostList from './PostList';

interface PaginatedPostListProps {
  posts: PostSummary[];
  emptyMessage?: string;
}

/** 한 페이지에 10개씩 보여주고, 넘치면 다음 페이지로 넘긴다. */
function PaginatedPostList({ posts, emptyMessage }: PaginatedPostListProps) {
  const totalPages = getTotalPages(posts.length, POSTS_PER_PAGE);
  const { currentPage, changePage } = usePageParam(totalPages);

  return (
    <>
      <PostList posts={paginate(posts, currentPage, POSTS_PER_PAGE)} emptyMessage={emptyMessage} />
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={changePage} />
    </>
  );
}

export default PaginatedPostList;
