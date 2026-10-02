import { CustomBlank } from '@/shared/ui/blank/CustomBlank';
import { CustomPagination } from '@/shared/ui/pagination/CustomPagination';

import { ListItem } from './ListItem';

// 블로그 글 최대 10개
const POSTS_PER_PAGE = 10;

/** @returns 최대 10개의 블로그 글과 하단 페이지네이션 영역 */
export function BlogPostList() {
  return (
    <div className="flex w-full flex-1 flex-col items-center">
      <ul className="flex w-full max-w-[688px] flex-col">
        {Array.from({ length: POSTS_PER_PAGE }, (_, index) => (
          <li key={index}>
            <ListItem />
          </li>
        ))}
      </ul>

      <div className="mt-auto flex shrink-0 flex-col items-center">
        <CustomBlank variant="32" />

        <CustomPagination currentPage={1} totalPages={10} onPageChange={() => {}} />

        <CustomBlank variant="64" />
      </div>
    </div>
  );
}
