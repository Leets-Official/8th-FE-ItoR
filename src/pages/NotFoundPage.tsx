import { Link } from 'react-router';
import EmptyState from '@/components/common/EmptyState';
import Header from '@/components/layout/Header';
import { ROUTES } from '@/constants/routes';

function NotFoundPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-[680px] px-4 py-20">
        <h1 className="sr-only">페이지를 찾을 수 없음</h1>
        <EmptyState
          message="페이지를 찾을 수 없습니다."
          action={
            <Link to={ROUTES.HOME} className="text-sm text-point underline underline-offset-2">
              홈으로 돌아가기
            </Link>
          }
        />
      </main>
    </>
  );
}

export default NotFoundPage;
