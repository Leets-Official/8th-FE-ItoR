import { useRef, useState } from 'react';
import { Navigate } from 'react-router';
import { AccountInfo, ProfileEditForm, useAuth } from '@/features/auth';
import { PageHeader, useSidebar } from '@/shared/ui';

// /profile — 내 프로필 설정. 수정하기를 누르면 페이지 이동 없이 같은 자리에서 고친다
export function ProfilePage() {
  const { currentUser } = useAuth();
  const { openSidebar } = useSidebar();
  const [isEditing, setIsEditing] = useState(false);
  const editFormRef = useRef<HTMLFormElement>(null);

  // 로그아웃하거나 비로그인으로 들어오면 볼 내 정보가 없으므로 메인으로 보낸다
  if (!currentUser) return <Navigate to="/" replace />;

  return (
    <div className="min-h-svh bg-white">
      {isEditing ? (
        <PageHeader
          variant="profile-edit"
          className="sticky top-0 z-10"
          onMenu={openSidebar}
          onCancel={() => setIsEditing(false)}
          // 검증과 저장은 폼의 submit에서 처리한다
          onSave={() => editFormRef.current?.requestSubmit()}
        />
      ) : (
        <PageHeader
          variant="profile"
          className="sticky top-0 z-10"
          onMenu={openSidebar}
          onEdit={() => setIsEditing(true)}
        />
      )}
      <main className="flex w-full flex-col items-center">
        {isEditing ? (
          <ProfileEditForm
            ref={editFormRef}
            user={currentUser}
            onSuccess={() => setIsEditing(false)}
          />
        ) : (
          <AccountInfo user={currentUser} />
        )}
      </main>
    </div>
  );
}
