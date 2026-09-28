import type { ReactNode } from 'react';

interface PageBannerProps {
  children: ReactNode;
}

/** 페이지 상단의 회색 배경 영역 (회원가입 제목, 프로필 영역 등) */
function PageBanner({ children }: PageBannerProps) {
  return (
    <section className="bg-gray-50">
      <div className="mx-auto max-w-[680px] px-4 py-8 md:py-14">{children}</div>
    </section>
  );
}

export default PageBanner;
