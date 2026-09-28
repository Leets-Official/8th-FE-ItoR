import { MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router';
import Button from '@/components/common/Button';
import Logo from '@/components/common/Logo';
import Header from '@/components/layout/Header';
import PageBanner from '@/components/layout/PageBanner';
import { ROUTES } from '@/constants/routes';

/** 회원가입 방법 선택: 이메일 또는 카카오 */
function SignupPage() {
  const navigate = useNavigate();

  return (
    <>
      <Header />
      <main>
        <PageBanner>
          <h1 className="text-xl font-medium text-ink">회원가입</h1>
        </PageBanner>
        <div className="mx-auto flex max-w-[680px] flex-col items-center gap-10 px-4 py-16 md:flex-row md:justify-between md:py-20">
          <div className="flex flex-col items-center gap-4">
            <Logo size="lg" />
            <p className="text-xs text-gray-400">You can make anything by writing</p>
          </div>
          <div className="flex w-full max-w-60 flex-col items-center gap-2">
            <Button
              variant="solid-point"
              size="md"
              fullWidth
              onClick={() => navigate(ROUTES.SIGNUP_FORM)}
            >
              이메일로 회원가입
            </Button>
            <span className="text-[11px] text-gray-400">또는</span>
            <Button
              variant="kakao"
              size="md"
              fullWidth
              onClick={() => navigate(`${ROUTES.SIGNUP_FORM}?provider=kakao`)}
            >
              <MessageCircle size={16} fill="currentColor" aria-hidden />
              카카오로 회원가입
            </Button>
          </div>
        </div>
      </main>
    </>
  );
}

export default SignupPage;
