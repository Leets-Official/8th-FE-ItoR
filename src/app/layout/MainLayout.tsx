import { Outlet, useMatches } from '@tanstack/react-router';
import { PageHeader } from '@/shared/ui/header/PageHeader';
import { ToastProvider } from '@/shared/ui/toast/ToastProvider';

/** @returns 페이지별 헤더와 반응형 콘텐츠 영역을 제공하는 공통 레이아웃 */
function MainLayout() {
  const header = useMatches({
    select: (matches) => ({
      variant: matches.at(-1)?.staticData.headerVariant ?? 'ver4',
      formId: matches.at(-1)?.staticData.headerFormId,
    }),
  });

  return (
    <ToastProvider>
      <div className="flex min-h-dvh w-full flex-col bg-white">
        <div className="sticky top-0 z-50 w-full shrink-0">
          <PageHeader variant={header.variant} formId={header.formId} />
        </div>

        <main className="flex w-full flex-1 flex-col">
          <Outlet />
        </main>
      </div>
    </ToastProvider>
  );
}

export default MainLayout;
