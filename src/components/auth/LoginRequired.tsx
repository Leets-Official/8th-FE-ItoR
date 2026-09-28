import { Outlet } from 'react-router';
import Button from '@/components/common/Button';
import EmptyState from '@/components/common/EmptyState';
import Header from '@/components/layout/Header';
import { useAuth } from '@/hooks/useAuth';
import { useLoginModal } from '@/hooks/useLoginModal';

/** 글쓰기, 마이페이지, 설정처럼 로그인한 사용자만 볼 수 있는 페이지를 감싸는 라우트 레이아웃 */
function LoginRequired() {
  const { isLoggedIn } = useAuth();
  const { openLoginModal } = useLoginModal();

  if (isLoggedIn) return <Outlet />;

  return (
    <>
      <Header />
      <main className="mx-auto max-w-[680px] px-4 py-20">
        <h1 className="sr-only">로그인 필요</h1>
        <EmptyState
          message="로그인이 필요한 페이지입니다."
          description="로그인 후 이용해주세요."
          action={
            <Button variant="solid-ink" onClick={openLoginModal}>
              로그인하기
            </Button>
          }
        />
      </main>
    </>
  );
}

export default LoginRequired;
