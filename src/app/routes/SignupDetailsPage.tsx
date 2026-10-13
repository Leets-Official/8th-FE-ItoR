import { Link, useNavigate, useOutletContext } from 'react-router';

import type { SignupMethod } from '@/features/auth/model/signup';
import { SignupForm } from '@/features/auth/ui/SignupForm';
import { SignupHeader } from '@/features/auth/ui/SignupHeader';
import { KakaoAuthButton } from '@/features/auth/ui/AuthMethodButtons';
import { startKakaoAuth } from '@/features/auth/api/startKakaoAuth';
import { getApiErrorMessage } from '@/shared/apis/response';
import { notify } from '@/shared/ui/StatusToast';

import type { AppLayoutContext } from '../layouts/AppLayout';

export function SignupDetailsPage({ method }: { method: SignupMethod }) {
  const { openLogin } = useOutletContext<AppLayoutContext>();
  const navigate = useNavigate();
  if (method === 'kakao')
    return (
      <main className="p-8 text-center font-auth">
        <h1>카카오 추가 회원가입은 준비 중입니다.</h1>
        <div className="mx-auto mt-4 max-w-sm">
          <KakaoAuthButton
            onClick={() => {
              try {
                startKakaoAuth();
              } catch (error) {
                notify.error(getApiErrorMessage(error));
              }
            }}
          >
            카카오 인증 시작
          </KakaoAuthButton>
        </div>
        <Link to="/mypage/signup/email" className="mt-4 inline-block text-gitlog-action underline">
          이메일로 회원가입
        </Link>
      </main>
    );
  return (
    <main>
      <SignupHeader description="가입을 위해 회원님의 정보를 입력해주세요." />
      <SignupForm
        key={method}
        method={method}
        onLogin={openLogin}
        onComplete={() => navigate('/', { replace: true })}
      />
    </main>
  );
}
