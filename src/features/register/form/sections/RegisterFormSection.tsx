/** 회원가입 정보 입력 페이지에서 인증 방식에 맞는 폼을 선택하는 영역입니다. */

import { readPendingKakaoRegistration } from '@/shared/auth/model/pendingKakaoRegistration';

import { EmailRegisterFormSection } from './EmailRegisterFormSection';
import { KakaoRegisterFormSection } from './KakaoRegisterFormSection';

type RegisterFormSectionProps = {
  method: 'email' | 'kakao';
};

export function RegisterFormSection({ method }: RegisterFormSectionProps) {
  if (method === 'kakao') {
    return <KakaoRegisterFormSection registration={readPendingKakaoRegistration()} />;
  }

  return <EmailRegisterFormSection />;
}
