import { useRef } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router';
import {
  hasKakaoSignUpPrompt,
  KAKAO_CALLBACK_PATH,
  KAKAO_SIGN_UP_PATH,
  LoginModalProvider,
  useAuth,
} from '@/features/auth';
import { Modal } from '@/shared/ui';

const SIGN_UP_PATH = '/signup';

// 모든 페이지를 감싸는 레이아웃 라우트. 자식 라우트가 바뀌어도 다시 마운트되지 않는다
export function RootLayout() {
  const { currentUser } = useAuth();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const isSignUpPage = pathname === SIGN_UP_PATH;
  // 이메일 회원가입(/signup/email)처럼 회원가입 하위 페이지와 카카오 회원가입에서 돌아오는 주소도 포함한다
  const isSignUpFlow = pathname.startsWith(SIGN_UP_PATH) || pathname === KAKAO_CALLBACK_PATH;

  // 이미 회원가입 페이지면 같은 주소가 히스토리에 쌓이지 않게 팝업만 닫는다
  function handleSignUp() {
    if (!isSignUpPage) navigate(SIGN_UP_PATH);
  }

  // 비로그인으로 접속하면 로그인 모달부터 띄우되, 회원가입하러 바로 들어온 경우는 제외한다
  return (
    <LoginModalProvider initialOpen={!currentUser && !isSignUpFlow} onSignUp={handleSignUp}>
      <Outlet />
      <KakaoSignUpPrompt />
    </LoginModalProvider>
  );
}

// 카카오 로그인 flow — 가입되지 않은 카카오 계정이면 출발한 페이지 위에서 회원가입 여부를 묻는다
function KakaoSignUpPrompt() {
  const { pathname, state } = useLocation();
  const navigate = useNavigate();
  const isOpen = hasKakaoSignUpPrompt(state);
  // 회원가입 버튼도 닫힘(onOpenChange)을 함께 일으키므로, 이동한 뒤 출발 페이지로 되돌리지 않게 막는다
  const isSigningUpRef = useRef(false);

  // 새로고침·뒤로 가기로 다시 묻지 않도록 state를 지운다
  function clearPrompt() {
    navigate(pathname, { replace: true, state: null });
  }

  function handleOpenChange(open: boolean) {
    if (open) return;
    if (isSigningUpRef.current) {
      isSigningUpRef.current = false;
      return;
    }
    clearPrompt();
  }

  function handleSignUp() {
    isSigningUpRef.current = true;
    clearPrompt();
    navigate(KAKAO_SIGN_UP_PATH);
  }

  return (
    <Modal
      open={isOpen}
      onOpenChange={handleOpenChange}
      title="가입되지 않은 계정이에요."
      description="회원가입을 진행할까요?"
      confirmLabel="회원가입 하기"
      onConfirm={handleSignUp}
    />
  );
}
