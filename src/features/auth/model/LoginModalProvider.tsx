import { useMemo, useState, type ReactNode } from 'react';
import { redirectToKakaoAuth } from '../api/kakaoAuth';
import { LoginModal } from '../ui/LoginModal';
import { LoginModalContext, type LoginModalContextValue } from './loginModalContext';

interface LoginModalProviderProps {
  // 마운트될 때 한 번만 읽는다. 이후 바뀌어도 모달을 다시 열지 않는다
  initialOpen?: boolean;
  onSignUp?: () => void;
  children: ReactNode;
}

// 로그인 모달을 앱에 하나만 두고, 어디서든 useLoginModal()로 연다
export function LoginModalProvider({
  initialOpen = false,
  onSignUp,
  children,
}: LoginModalProviderProps) {
  const [isOpen, setIsOpen] = useState(initialOpen);

  const value = useMemo<LoginModalContextValue>(
    () => ({ openLoginModal: () => setIsOpen(true) }),
    [],
  );

  return (
    <LoginModalContext.Provider value={value}>
      {children}
      <LoginModal
        open={isOpen}
        onOpenChange={setIsOpen}
        onKakaoLogin={() => redirectToKakaoAuth()}
        onSignUp={onSignUp}
      />
    </LoginModalContext.Provider>
  );
}
