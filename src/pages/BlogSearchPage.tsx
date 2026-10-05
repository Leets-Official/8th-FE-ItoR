import { useState } from 'react';
import { Link } from 'react-router';
import { LoginModal, useAuth } from '@/features/auth';
import { MOCK_POSTS, PostListItem } from '@/features/post';
import { Blank, Modal, PageHeader, Pagination, Sidebar } from '@/shared/ui';

const POSTS_PER_PAGE = 10;

export function BlogSearchPage() {
  const { currentUser, logout } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const pageCount = Math.ceil(MOCK_POSTS.length / POSTS_PER_PAGE);
  const posts = MOCK_POSTS.slice((currentPage - 1) * POSTS_PER_PAGE, currentPage * POSTS_PER_PAGE);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0 });
  };

  const handleStart = () => {
    setIsSidebarOpen(false);
    setIsLoginModalOpen(true);
  };

  const handleLogout = () => {
    logout();
    setIsSidebarOpen(false);
  };

  return (
    <div className="min-h-svh bg-white">
      <PageHeader
        variant="main"
        className="sticky top-0 z-10"
        onMenu={() => setIsSidebarOpen(true)}
      />
      <Sidebar
        open={isSidebarOpen}
        onOpenChange={setIsSidebarOpen}
        profile={currentUser}
        onStart={handleStart}
        onLogout={() => setIsLogoutModalOpen(true)}
      />
      <LoginModal open={isLoginModalOpen} onOpenChange={setIsLoginModalOpen} />
      <Modal
        open={isLogoutModalOpen}
        onOpenChange={setIsLogoutModalOpen}
        title="로그아웃을 진행할게요"
        confirmLabel="로그아웃"
        onConfirm={handleLogout}
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
