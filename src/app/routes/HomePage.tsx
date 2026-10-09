import { useEffect, useRef } from 'react';

import { useOutletContext, useSearchParams } from 'react-router';

import { POSTS_PER_PAGE } from '@/features/posts/model/post';
import { PostListItem } from '@/features/posts/ui/PostListItem';
import { Pagination } from '@/shared/ui/Pagination';
import { useCurrentTime } from '@/shared/hooks/useCurrentTime';

import type { AppLayoutContext } from '../layouts/AppLayout';

export function HomePage() {
  const { posts: allPosts, commentsByPost } = useOutletContext<AppLayoutContext>();
  const [searchParams, setSearchParams] = useSearchParams();
  const now = useCurrentTime();
  const heading = useRef<HTMLHeadingElement>(null);
  const totalPages = Math.ceil(allPosts.length / POSTS_PER_PAGE);
  const requestedPage = Number(searchParams.get('page') ?? 1);
  const page = Number.isInteger(requestedPage)
    ? Math.min(Math.max(requestedPage, 1), totalPages)
    : 1;
  const posts = allPosts.slice((page - 1) * POSTS_PER_PAGE, page * POSTS_PER_PAGE);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [page]);

  function changePage(nextPage: number) {
    const params = new URLSearchParams(searchParams);
    if (nextPage === 1) params.delete('page');
    else params.set('page', String(nextPage));
    setSearchParams(params);
    heading.current?.focus({ preventScroll: true });
  }

  return (
    <main className="mx-auto w-full max-w-[688px] pt-5 pb-9 font-auth sm:pt-8 sm:pb-16">
      <h1 ref={heading} tabIndex={-1} className="sr-only">
        깃로그 게시글 목록
      </h1>
      <ul aria-label="게시글 목록">
        {posts.map((post) => (
          <PostListItem
            key={post.id}
            post={{ ...post, commentCount: commentsByPost[post.id]?.length ?? post.commentCount }}
            now={now}
          />
        ))}
      </ul>
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={changePage}
        className="mt-5 justify-center sm:mt-8"
      />
    </main>
  );
}
