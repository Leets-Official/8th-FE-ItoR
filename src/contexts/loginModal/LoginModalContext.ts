import { createContext } from 'react';

export interface LoginModalContextValue {
  openLoginModal: () => void;
  closeLoginModal: () => void;
}

export const LoginModalContext = createContext<LoginModalContextValue | null>(null);
