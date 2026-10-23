import { useState } from 'react';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router';
import { useAuth, useLoginModal } from '@/features/auth';
import { getPosts, PostListItem, postQueryKeys } from '@/features/post';
import { Blank, PageHeader, Pagination, useSidebar } from '@/shared/ui';

const POSTS_PER_PAGE = 10;

export function BlogSearchPage() {
  const { openSidebar } = useSidebar();
  const { currentUser } = useAuth();
  const { openLoginModal } = useLoginModal();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isError } = useQuery({
    queryKey: postQueryKeys.list(currentPage, POSTS_PER_PAGE),
    queryFn: () => getPosts(currentPage, POSTS_PER_PAGE),
    // 다음 페이지를 불러오는 동안 목록·페이지네이션이 사라졌다 나타나지 않게 이전 페이지를 보여 둔다
    placeholderData: keepPreviousData,
  });
  const posts = data?.posts ?? [];
  const pageCount = data?.pageCount ?? 0;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0 });
  };

  // 글쓰기는 로그인한 사용자만 할 수 있어 비로그인이면 로그인 모달을 연다
  function handleCreate() {
    if (!currentUser) {
      openLoginModal();
      return;
    }
    navigate('/write');
  }

  return (
    <div className="min-h-svh bg-white">
      <PageHeader
        variant="main"
        className="sticky top-0 z-10"
        onMenu={openSidebar}
        onCreate={handleCreate}
      />
      <main className="mx-auto flex w-full max-w-[688px] flex-col items-center">
        <Blank size={32} />
        {isError && <p className="py-16 text-14 text-gray-56">게시글을 불러오지 못했습니다.</p>}
        {data && posts.length === 0 && (
          <p className="py-16 text-14 text-gray-56">아직 작성된 깃로그가 없어요.</p>
        )}
        <ul className="w-full">
          {posts.map((post) => (
            <li key={post.id}>
              <Link to={`/posts/${post.id}`} className="block">
                <PostListItem post={post} />
              </Link>
            </li>
          ))}
        </ul>
        <Blank size={32} />
        {pageCount > 0 && (
          <Pagination
            pageCount={pageCount}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        )}
        <Blank size={64} />
      </main>
    </div>
  );
}
