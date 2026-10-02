import { CommentSection } from '@/features/blog_detail/components/section/CommentSection';
import { MainSection } from '@/features/blog_detail/components/section/MainSection';
import { ProfileSection } from '@/features/blog_detail/components/section/ProfileSection';
import { TitleSection } from '@/features/blog_detail/components/section/TitleSection';

/** @returns 블로그 상세 페이지 UI */
export function BlogDetailPage() {
  return (
    <section className="flex h-fit w-full flex-col items-center justify-center">
      <TitleSection />
      <MainSection />
      <CommentSection />
      <ProfileSection />
    </section>
  );
}

export default BlogDetailPage;
