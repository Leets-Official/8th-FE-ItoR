import { KakaoRegistrationDialog } from '@/features/main/components/KakaoRegistrationDialog';
import { MainPostListSection } from '@/features/main/sections/MainPostListSection';

/** @returns 메인 페이지 UI가 배치될 반응형 콘텐츠 틀 */
export default function MainPage() {
  return (
    <section className="flex w-full flex-1 flex-col items-center">
      <h1 className="sr-only">깃로그 게시글</h1>
      <MainPostListSection />
      <KakaoRegistrationDialog />
    </section>
  );
}
