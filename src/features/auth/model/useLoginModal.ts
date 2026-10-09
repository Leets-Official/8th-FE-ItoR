import { useContext } from 'react';
import { LoginModalContext } from './loginModalContext';

export function useLoginModal() {
  const context = useContext(LoginModalContext);
  if (!context) {
    throw new Error('useLoginModal은 LoginModalProvider 안에서만 사용할 수 있습니다.');
  }

  return context;
}
