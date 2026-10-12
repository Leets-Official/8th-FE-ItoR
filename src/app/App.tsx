import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from 'react-router/dom';
import { AuthProvider, LoginModal, useAuth } from '@/features/auth';
import { Toaster } from '@/shared/ui';
import { router } from './router';

const queryClient = new QueryClient();

// 접속했을 때 비로그인 상태면 로그인 모달부터 띄운다. App은 페이지를 옮겨도 다시 마운트되지 않아 닫은 뒤에는 다시 뜨지 않는다
function InitialLoginModal() {
  const { currentUser } = useAuth();
  const [isOpen, setIsOpen] = useState(!currentUser);

  // RouterProvider 바깥이라 useNavigate를 쓸 수 없어 router로 직접 이동한다
  return (
    <LoginModal
      open={isOpen}
      onOpenChange={setIsOpen}
      onSignUp={() => router.navigate('/signup')}
    />
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
        <InitialLoginModal />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
