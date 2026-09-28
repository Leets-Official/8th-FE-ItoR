import { useContext } from 'react';
import { LoginModalContext } from '@/contexts/loginModal/LoginModalContext';

export const useLoginModal = () => {
  const context = useContext(LoginModalContext);
  if (!context) throw new Error('useLoginModal은 LoginModalProvider 안에서 사용해야 합니다.');
  return context;
};
