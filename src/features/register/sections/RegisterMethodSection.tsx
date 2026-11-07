/** 회원가입 페이지의 가입 방법 선택 영역입니다. */

import { useNavigate } from '@tanstack/react-router';

import { getKakaoLoginUrl } from '@/shared/auth/api/authApi';
import { AuthMethodButton } from '@/shared/ui/auth/AuthMethodButton';
import { BrandPanel } from '@/shared/ui/auth/BrandPanel';
import GitlogLogo from '@/shared/ui/logo/GITLOG_B.svg?react';

export function RegisterMethodSection() {
  const navigate = useNavigate();

  async function moveToEmailRegisterPage() {
    await navigate({ to: '/register/form', search: { method: 'email' } });
  }

  function startKakaoLogin() {
    window.location.assign(getKakaoLoginUrl());
  }

  return (
    <section className="flex h-[548px] w-full items-center justify-center gap-2.5 px-4 mobile:flex-col">
      <div className="flex h-fit w-full max-w-[782px] items-center justify-center rounded-[9px] py-20 mobile:flex-col">
        <BrandPanel logo={GitlogLogo} />

        <div className="flex h-fit w-full min-w-[240px] flex-col items-center justify-center gap-0.5 px-4">
          <div className="flex h-fit w-full min-w-[240px] max-w-[344px] flex-col gap-2.5 px-4 py-1" />
          <div className="flex h-fit w-full min-w-[240px] max-w-[344px] gap-2.5 px-4 py-1">
            <AuthMethodButton
              method="email"
              label="이메일로 회원가입"
              onClick={moveToEmailRegisterPage}
            />
          </div>

          <div className="flex w-[313px] items-center justify-center gap-0.5">
            <div className="h-px flex-1 bg-gray-96" />
            <div className="flex shrink-0 rounded-[2px] px-2 pb-1 pt-0.5">
              <span className="text-12-regular text-gray-56">또는</span>
            </div>
            <div className="h-px flex-1 bg-gray-96" />
          </div>

          <div className="flex h-fit w-full min-w-[240px] max-w-[344px] gap-2.5 px-4 py-1">
            <AuthMethodButton method="kakao" label="카카오로 회원가입" onClick={startKakaoLogin} />
          </div>
        </div>
      </div>
    </section>
  );
}
