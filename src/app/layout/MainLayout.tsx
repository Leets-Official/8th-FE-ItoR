import { Outlet, useMatches } from '@tanstack/react-router';
import { PageHeader } from '@/shared/ui/header/PageHeader';

/** @returns 페이지별 헤더와 반응형 콘텐츠 영역을 제공하는 공통 레이아웃 */
function MainLayout() {
  const headerVariant = useMatches({
    select: (matches) => matches.at(-1)?.staticData.headerVariant ?? 'ver4',
  });

  return (
    <div className="flex min-h-dvh w-full flex-col bg-white">
      <div className="sticky top-0 z-50 w-full shrink-0">
        <PageHeader variant={headerVariant} />
      </div>

      <main className="flex w-full flex-1 flex-col">
        <Outlet />
      </main>
    </div>
  );
}

export default MainLayout;
