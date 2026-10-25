import { createContext } from 'react';

export type Toast = {
  /** 성공 알림은 `positive`, 오류 알림은 `negative`를 사용합니다. */
  variant: 'positive' | 'negative';
  /** 토스트에 표시할 짧은 알림 문구입니다. */
  message: string;
};

export type ToastContextValue = {
  /** 새 토스트를 표시하며 기존 토스트가 있으면 교체합니다. */
  showToast: (toast: Toast) => void;
  /** 현재 표시 중인 토스트를 즉시 숨깁니다. */
  hideToast: () => void;
};

/** ToastProvider와 useToast를 연결하는 내부 Context입니다. */
export const ToastContext = createContext<ToastContextValue | null>(null);
