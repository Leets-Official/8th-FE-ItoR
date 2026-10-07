import { useState } from 'react';
import { LoginModal, SignUpPanel, useAuth } from '@/features/auth';
import { PageHeader, Sidebar } from '@/shared/ui';

export function SignUpPage() {
  const { currentUser } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const handleStart = () => {
    setIsSidebarOpen(false);
    setIsLoginModalOpen(true);
  };

  return (
    <div className="min-h-svh bg-white">
      <PageHeader
        variant="basic"
        className="sticky top-0 z-10"
        onMenu={() => setIsSidebarOpen(true)}
      />
      <Sidebar
        open={isSidebarOpen}
        onOpenChange={setIsSidebarOpen}
        profile={currentUser}
        onStart={handleStart}
      />
      {/* 이미 회원가입 페이지라 팝업의 회원가입 버튼은 팝업만 닫는다 */}
      <LoginModal open={isLoginModalOpen} onOpenChange={setIsLoginModalOpen} />
      {/* 제목 영역은 회색 배경이라 흰 배경인 Blank 대신 pt-8·pb-5로 시안의 32px·20px 여백을 준다 */}
      <section className="flex w-full flex-col items-center bg-gray-96 pt-8 pb-5">
        <h1 className="w-full max-w-[688px] px-4 py-3 text-24 font-medium text-black">회원가입</h1>
      </section>
      <main className="flex w-full flex-col items-center px-4">
        <SignUpPanel />
      </main>
    </div>
  );
}
