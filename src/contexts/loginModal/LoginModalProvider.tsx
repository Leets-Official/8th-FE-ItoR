import { useState, type ReactNode } from 'react';
import LoginModal from '@/components/auth/LoginModal';
import { LoginModalContext } from './LoginModalContext';

/** 로그인이 필요한 곳(헤더, 사이드바, 댓글 등) 어디서든 같은 로그인 모달을 열 수 있게 한다. */
function LoginModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const openLoginModal = () => setIsOpen(true);
  const closeLoginModal = () => setIsOpen(false);

  return (
    <LoginModalContext value={{ openLoginModal, closeLoginModal }}>
      {children}
      {isOpen && <LoginModal onClose={closeLoginModal} />}
    </LoginModalContext>
  );
}

export default LoginModalProvider;
