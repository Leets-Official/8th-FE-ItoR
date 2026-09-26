import { BlogPostList } from '@/features/main/components/BlogPostList';
import { CustomBlank } from '@/shared/ui/blank/CustomBlank';

/** @returns 메인 페이지 UI가 배치될 반응형 콘텐츠 틀 */
function MainPage() {
  return (
    <section className="flex w-full flex-1 flex-col items-center">
      <CustomBlank variant="32" />
      <BlogPostList />
    </section>
  );
}

export default MainPage;
