/** 마이페이지의 작성 게시글 목록과 페이지네이션 영역입니다. */

import { useState } from 'react';

import { Spacer } from '@/shared/ui/spacing/Spacer';
import { Pagination } from '@/shared/ui/pagination/Pagination';
import { PostListItem } from '@/shared/ui/post/PostListItem';

import type { MyPost } from '../model/my';

const POSTS_PER_PAGE = 5;

type MyPostListSectionProps = {
  posts: readonly MyPost[];
};

export function MyPostListSection({ posts }: MyPostListSectionProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);
  const firstPostIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const visiblePosts = posts.slice(firstPostIndex, firstPostIndex + POSTS_PER_PAGE);

  return (
    <section className="flex w-full flex-col items-center">
      <Spacer variant="32" />

      <ul className="flex w-full max-w-[688px] flex-col">
        {visiblePosts.map(({ id, ...post }) => (
          <li key={id}>
            <PostListItem {...post} />
          </li>
        ))}
      </ul>

      {totalPages > 0 ? (
        <div className="flex shrink-0 flex-col items-center">
          <Spacer variant="32" />

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />

          <Spacer variant="64" />
        </div>
      ) : null}
    </section>
  );
}
/** 마이페이지의 작성 게시글 목록과 페이지네이션 영역입니다. */
