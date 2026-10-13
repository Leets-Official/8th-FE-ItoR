import { Link, useNavigate } from 'react-router';

import {
  AuthDivider,
  EmailAuthButton,
  KakaoAuthButton,
} from '@/features/auth/ui/AuthMethodButtons';
import { AuthPanel } from '@/features/auth/ui/AuthPanel';
import { SignupHeader } from '@/features/auth/ui/SignupHeader';

export function SignupPage() {
  const navigate = useNavigate();

  return (
    <main>
      <SignupHeader />
      <section aria-label="회원가입 방법 선택" className="min-h-[548px] px-4">
        <AuthPanel>
          <EmailAuthButton asChild>
            <Link to="/mypage/signup/email">이메일로 회원가입</Link>
          </EmailAuthButton>
          <AuthDivider />
          <KakaoAuthButton onClick={() => navigate('/mypage/signup/kakao')}>
            카카오로 회원가입
          </KakaoAuthButton>
        </AuthPanel>
      </section>
    </main>
  );
}
