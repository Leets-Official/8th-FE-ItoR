import KakaoIcon from '@/shared/assets/icons/svg/kakao.svg?react';

/** 카카오 인증으로 가입 중임을 읽기 전용 정보로 표시합니다. */
export function SocialLoginField() {
  return (
    <div className="flex h-fit w-[688px] max-w-full flex-col gap-3 px-4 py-3">
      <span className="text-14-light px-[6px] text-gray-56">소셜 로그인</span>
      <div className="text-14-light flex w-full items-center gap-2.5 rounded-[4px] border border-gray-90 bg-gray-90 px-4 py-3 text-gray-56">
        <KakaoIcon aria-hidden="true" className="h-[18px] w-[18px] shrink-0" />
        <span>카카오 로그인</span>
      </div>
    </div>
  );
}
