import { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import {
  getKakaoReturnPath,
  KAKAO_SIGN_UP_PATH,
  KAKAO_SIGN_UP_PROMPT_STATE,
} from '@/features/auth';
import { showToast } from '@/shared/ui';

// 카카오 로그인 후 돌아오는 Redirect URI. 인가 코드를 토큰으로 바꾸려면 client secret을 가진 서버가 필요하다
export function KakaoCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  // StrictMode에서 effect가 두 번 실행돼 토스트가 겹치지 않게 한 번만 처리한다
  const isHandledRef = useRef(false);

  useEffect(() => {
    if (isHandledRef.current) return;
    isHandledRef.current = true;

    // 인가 코드가 담긴 주소가 히스토리에 남지 않게 모두 교체한다
    const returnPath = getKakaoReturnPath(searchParams.get('state'));

    // 사용자가 동의 화면에서 취소하면 code 대신 error=access_denied로 돌아온다
    if (searchParams.get('error') || !searchParams.get('code')) {
      showToast('negative', '카카오 로그인이 취소되었습니다.');
      navigate(returnPath, { replace: true });
      return;
    }

    // TODO: 서버 API가 생기면 code를 보내 가입된 계정인지 확인하고, 가입된 계정이면 로그인시켜 returnPath로 보낸다.
    // 지금은 모두 가입되지 않은 계정으로 본다

    // 회원가입 페이지에서 "카카오로 회원가입"을 누른 경우는 이미 가입하려는 것이라 묻지 않는다
    if (returnPath.startsWith('/signup')) {
      navigate(KAKAO_SIGN_UP_PATH, { replace: true });
      return;
    }
    // 출발한 페이지로 돌아가 그 위에서 회원가입 여부를 묻는다 (RootLayout)
    navigate(returnPath, { replace: true, state: KAKAO_SIGN_UP_PROMPT_STATE });
  }, [navigate, searchParams]);

  return null;
}
