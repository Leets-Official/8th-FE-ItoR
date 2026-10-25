import { useEffect, useState, type ReactNode } from 'react';

import { Toast } from './Toast';
import { ToastContext, type Toast as ToastState } from './toastContext';

export type ToastProviderProps = {
  /** 전역 토스트를 사용할 애플리케이션 영역입니다. */
  children: ReactNode;
};

/** `useToast`로 요청한 메시지를 화면 상단에 3초 동안 표시하는 Provider입니다. */
export function ToastProvider({ children }: ToastProviderProps) {
  const [toast, setToast] = useState<ToastState | null>(null);

  useEffect(() => {
    if (!toast) {
      return;
    }

    const timeoutId = window.setTimeout(() => setToast(null), 3000);

    return () => window.clearTimeout(timeoutId);
  }, [toast]);

  function showToast(nextToast: ToastState) {
    setToast(nextToast);
  }

  function hideToast() {
    setToast(null);
  }

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}

      {toast ? (
        <div className="fixed left-1/2 top-[88px] z-[60] -translate-x-1/2">
          <Toast variant={toast.variant} message={toast.message} />
        </div>
      ) : null}
    </ToastContext.Provider>
  );
}
