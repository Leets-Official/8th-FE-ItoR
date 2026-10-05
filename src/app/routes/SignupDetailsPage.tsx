import { useOutletContext } from 'react-router';

import type { SignupMethod } from '@/features/auth/model/signup';
import { SignupForm } from '@/features/auth/ui/SignupForm';
import { SignupHeader } from '@/features/auth/ui/SignupHeader';

import type { AppLayoutContext } from '../layouts/AppLayout';

export function SignupDetailsPage({ method }: { method: SignupMethod }) {
  const { openLogin } = useOutletContext<AppLayoutContext>();
  return (
    <main>
      <SignupHeader description="가입을 위해 회원님의 정보를 입력해주세요." />
      <SignupForm key={method} method={method} onLogin={openLogin} />
    </main>
  );
}
