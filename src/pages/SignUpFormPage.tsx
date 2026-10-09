import { useState } from 'react';
import { useNavigate } from 'react-router';
import { SignUpForm, useAuth, useLoginModal } from '@/features/auth';
import { Modal, PageHeader, Sidebar } from '@/shared/ui';

// /signup/email — 가입 정보 입력
export function SignUpFormPage() {
  const { currentUser } = useAuth();
  const { openLoginModal } = useLoginModal();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);

  const handleStart = () => {
    setIsSidebarOpen(false);
    openLoginModal();
  };

  // 확인·로그인하기·ESC 어느 쪽으로 닫아도 메인으로 보낸다.
  // 뒤로 가기로 다 쓴 가입 폼에 돌아오지 않게 히스토리를 교체한다
  const handleCompleteModalOpenChange = (open: boolean) => {
    setIsCompleteModalOpen(open);
    if (!open) navigate('/', { replace: true });
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
      {/* 제목 영역은 회색 배경이라 흰 배경인 Blank 대신 pt-8·pb-5로 시안의 32px·20px 여백을 준다 */}
      <section className="flex w-full flex-col items-center bg-gray-96 pt-8 pb-5">
        <h1 className="w-full max-w-[688px] px-4 py-3 text-24 font-medium text-black">회원가입</h1>
        <p className="w-full max-w-[688px] px-4 py-3 text-14 font-light text-black">
          가입을 위해 회원님의 정보를 입력해주세요.
        </p>
      </section>
      <main className="flex w-full flex-col items-center">
        <SignUpForm onSuccess={() => setIsCompleteModalOpen(true)} />
      </main>
      {/* 로그인 모달은 RootLayout에 있어 메인으로 이동해도 닫히지 않는다 */}
      <Modal
        open={isCompleteModalOpen}
        onOpenChange={handleCompleteModalOpenChange}
        title="회원가입이 완료되었습니다!"
        cancelLabel="확인"
        confirmLabel="로그인하기"
        onConfirm={openLoginModal}
      />
    </div>
  );
}
