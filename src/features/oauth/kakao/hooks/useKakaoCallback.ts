import { useEffect, useRef, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';

import { getOAuthLoginRedirect } from '@/shared/auth/api/authApi';
import { useAuth } from '@/shared/auth/hooks/useAuth';
import { isLoginPostResponse } from '@/shared/auth/model/auth';
import { writePendingKakaoRegistration } from '@/shared/auth/model/pendingKakaoRegistration';
import { getApiErrorMessage } from '@/shared/api/apiClient';

export function useKakaoCallback(code: string | undefined) {
  const navigate = useNavigate();
  const { completeLogin } = useAuth();
  const hasRequested = useRef(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (hasRequested.current) {
      return;
    }

    hasRequested.current = true;

    async function completeKakaoLogin() {
      if (!code) {
        setErrorMessage('카카오 인증 코드가 없습니다.');
        return;
      }

      try {
        const response = await getOAuthLoginRedirect(code);

        if (isLoginPostResponse(response)) {
          completeLogin(response);
          await navigate({ to: '/' });
          return;
        }

        writePendingKakaoRegistration(response);
        await navigate({
          to: '/register/form',
          search: { method: 'kakao' },
          replace: true,
        });
      } catch (error) {
        setErrorMessage(getApiErrorMessage(error, '카카오 로그인에 실패했습니다.'));
      }
    }

    void completeKakaoLogin();
  }, [code, completeLogin, navigate]);

  return { errorMessage };
}
