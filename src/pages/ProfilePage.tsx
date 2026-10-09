import { Navigate } from 'react-router';
import { AccountInfo, useAuth } from '@/features/auth';
import { PageHeader, useSidebar } from '@/shared/ui';

// /profile — 내 프로필 설정. 값을 확인만 하고, 수정하기로 수정 페이지에 넘어간다
export function ProfilePage() {
  const { currentUser } = useAuth();
  const { openSidebar } = useSidebar();

  // 로그아웃하거나 비로그인으로 들어오면 볼 내 정보가 없으므로 메인으로 보낸다
  if (!currentUser) return <Navigate to="/" replace />;

  return (
    <div className="min-h-svh bg-white">
      {/* TODO: 수정 페이지가 생기면 onEdit으로 연결한다 */}
      <PageHeader variant="profile" className="sticky top-0 z-10" onMenu={openSidebar} />
      <main className="flex w-full flex-col items-center">
        <AccountInfo user={currentUser} />
      </main>
    </div>
  );
}
