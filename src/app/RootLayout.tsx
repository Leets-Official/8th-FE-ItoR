import { Outlet, useLocation, useNavigate } from 'react-router';
import { LoginModalProvider, useAuth } from '@/features/auth';

const SIGN_UP_PATH = '/signup';

// 모든 페이지를 감싸는 레이아웃 라우트. 자식 라우트가 바뀌어도 다시 마운트되지 않는다
export function RootLayout() {
  const { currentUser } = useAuth();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const isSignUpPage = pathname === SIGN_UP_PATH;

  // 이미 회원가입 페이지면 같은 주소가 히스토리에 쌓이지 않게 팝업만 닫는다
  function handleSignUp() {
    if (!isSignUpPage) navigate(SIGN_UP_PATH);
  }

  // 비로그인으로 접속하면 로그인 모달부터 띄우되, 회원가입하러 바로 들어온 경우는 제외한다
  return (
    <LoginModalProvider initialOpen={!currentUser && !isSignUpPage} onSignUp={handleSignUp}>
      <Outlet />
    </LoginModalProvider>
  );
}
