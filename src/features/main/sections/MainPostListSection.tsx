/** 메인 페이지의 블로그 게시글 목록과 페이지네이션 영역입니다. */

import { Pagination } from '@/shared/ui/pagination/Pagination';
import { PostListItem } from '@/shared/ui/post/PostListItem';
import { Spacer } from '@/shared/ui/spacing/Spacer';

import type { MainPost } from '../model/post';

type MainPostListSectionProps = {
  posts: readonly MainPost[];
  totalPages: number;
};

export function MainPostListSection({ posts, totalPages }: MainPostListSectionProps) {
  return (
    <section className="flex w-full flex-1 flex-col items-center">
      <Spacer variant="32" />

      <ul className="flex w-full max-w-[688px] flex-col">
        {posts.map(({ id, ...post }) => (
          <li key={id}>
            <PostListItem {...post} />
          </li>
        ))}
      </ul>

      <div className="mt-auto flex shrink-0 flex-col items-center">
        <Spacer variant="32" />

        <Pagination currentPage={1} totalPages={totalPages} onPageChange={() => {}} />

        <Spacer variant="64" />
      </div>
    </section>
  );
}
