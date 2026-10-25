/** 카카오 로그인 콜백 페이지의 인증 처리 상태 영역입니다. */

import { useKakaoCallback } from '../hooks/useKakaoCallback';

type KakaoCallbackSectionProps = {
  code?: string;
};

export function KakaoCallbackSection({ code }: KakaoCallbackSectionProps) {
  const { errorMessage } = useKakaoCallback(code);

  return (
    <section className="flex min-h-[240px] w-full items-center justify-center px-4">
      <p className={`text-14-light ${errorMessage ? 'text-negative' : 'text-gray-56'}`}>
        {errorMessage || '카카오 로그인 정보를 확인하고 있습니다.'}
      </p>
    </section>
  );
}
