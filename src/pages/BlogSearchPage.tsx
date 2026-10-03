import { useState } from 'react';
import { Link } from 'react-router';
import { MOCK_POSTS, PostListItem } from '@/entities/post';
import { Blank, PageHeader, Pagination } from '@/shared/ui';

const POSTS_PER_PAGE = 10;

export function BlogSearchPage() {
  const [currentPage, setCurrentPage] = useState(1);

  const pageCount = Math.ceil(MOCK_POSTS.length / POSTS_PER_PAGE);
  const posts = MOCK_POSTS.slice((currentPage - 1) * POSTS_PER_PAGE, currentPage * POSTS_PER_PAGE);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0 });
  };

  return (
    <div className="min-h-svh bg-white">
      <PageHeader variant="main" className="sticky top-0 z-10" />
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
