import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuth, useLoginModal } from '@/features/auth';
import { getMockPosts, PostListItem } from '@/features/post';
import { Blank, PageHeader, Pagination, useSidebar } from '@/shared/ui';

const POSTS_PER_PAGE = 10;

export function BlogSearchPage() {
  const { openSidebar } = useSidebar();
  const { currentUser } = useAuth();
  const { openLoginModal } = useLoginModal();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);

  const allPosts = getMockPosts();
  const pageCount = Math.ceil(allPosts.length / POSTS_PER_PAGE);
  const posts = allPosts.slice((currentPage - 1) * POSTS_PER_PAGE, currentPage * POSTS_PER_PAGE);

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
        <Pagination
          pageCount={pageCount}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
        <Blank size={64} />
      </main>
    </div>
  );
}
