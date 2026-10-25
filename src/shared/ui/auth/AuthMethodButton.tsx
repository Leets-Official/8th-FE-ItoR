import KakaoIcon from '@/shared/assets/icons/svg/kakao.svg?react';

export type AuthMethodButtonProps = {
  /** 버튼에 적용할 인증 방식별 디자인입니다. */
  method: 'email' | 'kakao';
  /** 버튼에 표시할 로그인 또는 회원가입 동작 문구입니다. */
  label: string;
  /** 폼 제출 버튼으로 사용할 때 `submit`을 전달합니다. */
  type?: 'button' | 'submit';
  /** 요청 처리 중 추가 클릭을 막습니다. */
  disabled?: boolean;
  /** 인증 방식을 선택했을 때 실행할 동작입니다. */
  onClick?: () => void;
};

const BASE_BUTTON_STYLE =
  'text-14-regular flex h-[45px] w-full items-center justify-center rounded-[6px] px-[14px]';

/** 이메일과 카카오 인증 방식을 동일한 크기의 버튼으로 표시합니다. */
export function AuthMethodButton({
  method,
  label,
  type = 'button',
  disabled = false,
  onClick,
}: AuthMethodButtonProps) {
  if (method === 'email') {
    return (
      <button
        type={type}
        disabled={disabled}
        onClick={onClick}
        className={`${BASE_BUTTON_STYLE} bg-point text-white disabled:cursor-not-allowed disabled:opacity-60`}
      >
        {label}
      </button>
    );
  }

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${BASE_BUTTON_STYLE} bg-[#fee500] disabled:cursor-not-allowed disabled:opacity-60`}
    >
      <span className="flex items-center justify-center gap-2">
        <KakaoIcon aria-hidden="true" className="h-[18px] w-[18px] shrink-0" />
        <span
          className="align-bottom text-[15px] font-semibold leading-[150%] tracking-[0px]"
          style={{
            color: 'var(--kakao-text, rgba(0, 0, 0, 0.85))',
            fontFamily: "'Apple SD Gothic Neo', sans-serif",
          }}
        >
          {label}
        </span>
      </span>
    </button>
  );
}
