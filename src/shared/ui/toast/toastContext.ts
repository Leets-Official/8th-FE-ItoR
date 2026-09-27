import { createContext, useContext } from 'react';

export type Toast = {
  variant: 'positive' | 'negative';
  message: string;
};

export type ToastContextValue = {
  showToast: (toast: Toast) => void;
  hideToast: () => void;
};

export const ToastContext = createContext<ToastContextValue | null>(null);

/** @returns 전역 토스트를 표시하거나 숨기는 함수 */
export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error('useToast는 ToastProvider 내부에서 사용해야 합니다.');
  }

  return context;
}
