import { Outlet, ScrollRestoration, useNavigation } from 'react-router';
import AuthProvider from '@/contexts/auth/AuthProvider';
import LoginModalProvider from '@/contexts/loginModal/LoginModalProvider';
import ToastProvider from '@/contexts/toast/ToastProvider';

/**
 * 모든 페이지를 감싸는 최상위 레이아웃.
 * Provider를 라우터 안쪽에 두어야 로그인 모달 안에서도 Link/useNavigate를 쓸 수 있다.
 */
function RootLayout() {
  const navigation = useNavigation();
  const isPageLoading = navigation.state === 'loading';

  return (
    <AuthProvider>
      <ToastProvider>
        <LoginModalProvider>
          {isPageLoading && (
            <div
              role="progressbar"
              aria-label="페이지 불러오는 중"
              className="fixed inset-x-0 top-0 z-[70] h-0.5 animate-pulse bg-point"
            />
          )}
          <Outlet />
          <ScrollRestoration />
        </LoginModalProvider>
      </ToastProvider>
    </AuthProvider>
  );
}

export default RootLayout;
