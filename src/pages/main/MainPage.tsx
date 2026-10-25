import { MAIN_POSTS_MOCK, MAIN_TOTAL_PAGES_MOCK } from '@/features/main/mocks/posts.mock';
import { MainPostListSection } from '@/features/main/sections/MainPostListSection';

/** @returns 메인 페이지 UI가 배치될 반응형 콘텐츠 틀 */
export default function MainPage() {
  return (
    <section className="flex w-full flex-1 flex-col items-center">
      <MainPostListSection posts={MAIN_POSTS_MOCK} totalPages={MAIN_TOTAL_PAGES_MOCK} />
    </section>
  );
}
