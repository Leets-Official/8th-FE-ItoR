import { Link } from '@tanstack/react-router';

import KakaoIcon from '@/shared/assets/icons/svg/kakao.svg?react';

type EmailLoginMethodButtonProps = {
  /** 이메일 로그인 버튼을 표시합니다. */
  method: 'email';
  /** 이메일 인증 화면으로 이동하기 전에 실행할 동작입니다. */
  onClick?: () => void;
};

type KakaoLoginMethodButtonProps = {
  /** 카카오 로고와 전용 색상의 로그인 버튼을 표시합니다. */
  method: 'kakao';
  /** 카카오 로그인 요청을 시작할 때 실행할 동작입니다. */
  onClick?: () => void;
};

export type LoginMethodButtonProps = EmailLoginMethodButtonProps | KakaoLoginMethodButtonProps;

const BASE_BUTTON_STYLE =
  'text-14-regular flex h-[45px] w-full items-center justify-center rounded-[6px] px-[14px]';

/**
 * 로그인 또는 회원가입 화면에서 인증 방식을 선택하는 버튼입니다.
 * `email`은 이메일 인증 화면으로 이동하고, `kakao`는 전달한 클릭 동작을 실행합니다.
 */
export function LoginMethodButton({ method, onClick }: LoginMethodButtonProps) {
  if (method === 'email') {
    return (
      <Link
        to="/register/email"
        onClick={onClick}
        className={`${BASE_BUTTON_STYLE} bg-point text-white`}
      >
        이메일로 로그인
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={`${BASE_BUTTON_STYLE} bg-[#fee500]`}>
      <span className="flex items-center justify-center gap-2">
        <KakaoIcon aria-hidden="true" className="h-[18px] w-[18px] shrink-0" />
        <span
          className="align-bottom text-[15px] font-semibold leading-[150%] tracking-[0px]"
          style={{
            color: 'var(--kakao-text, rgba(0, 0, 0, 0.85))',
            fontFamily: "'Apple SD Gothic Neo', sans-serif",
          }}
        >
          카카오로 로그인
        </span>
      </span>
    </button>
  );
}
