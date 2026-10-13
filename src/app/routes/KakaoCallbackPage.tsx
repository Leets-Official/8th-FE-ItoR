import { useEffect, useRef, useState } from 'react';

import { Link, useSearchParams } from 'react-router';

import { useKakaoAuthMutation } from '@/features/auth/api/useKakaoAuthMutation';
import { startKakaoAuth } from '@/features/auth/api/startKakaoAuth';
import { readKakaoCallback } from '@/features/auth/lib/readKakaoCallback';
import { getApiErrorMessage } from '@/shared/apis/response';
import { GitlogButton } from '@/shared/ui/GitlogButton';

export function KakaoCallbackPage() {
  const [params, setParams] = useSearchParams();
  const [callback] = useState(() => readKakaoCallback(params));
  const requested = useRef(false);
  const { mutate, isSuccess, isError, error } = useKakaoAuthMutation();
  const [startError, setStartError] = useState('');

  useEffect(() => {
    if (requested.current) return;
    requested.current = true;
    // URL에서 인가 코드를 즉시 제거해 새로고침과 브라우저 기록에서 재사용하지 않는다.
    setParams({}, { replace: true });
    if (callback.code) mutate(callback.code);
  }, [callback, mutate, setParams]);

  const message = callback.error || (isError ? getApiErrorMessage(error) : '');
  const waiting = !message && !isSuccess;

  return (
    <main className="mx-auto max-w-xl space-y-4 px-4 py-16 text-center font-auth">
      <h1 className="text-xl font-semibold">카카오 인증</h1>
      {waiting ? (
        <p role="status">카카오 인증을 확인하고 있습니다.</p>
      ) : message ? (
        <p role="alert">{message}</p>
      ) : (
        <div role="status" className="space-y-2">
          <p>카카오 인증 요청이 정상적으로 처리되었습니다.</p>
          <p>현재 카카오 로그인과 추가 회원가입을 마칠 수 없습니다. 이메일로 이용해주세요.</p>
        </div>
      )}
      {!waiting && (
        <div className="flex flex-wrap justify-center gap-3">
          <GitlogButton
            onClick={() => {
              try {
                startKakaoAuth();
              } catch (failure) {
                setStartError(getApiErrorMessage(failure));
              }
            }}
          >
            카카오 인증 다시 시작
          </GitlogButton>
          <Link
            to="/mypage/signup/email"
            className="inline-flex h-9 items-center text-gitlog-action underline"
          >
            이메일로 회원가입
          </Link>
          <Link to="/" className="inline-flex h-9 items-center text-gitlog-action underline">
            홈으로
          </Link>
        </div>
      )}
      {startError && <p role="alert">{startError}</p>}
    </main>
  );
}
