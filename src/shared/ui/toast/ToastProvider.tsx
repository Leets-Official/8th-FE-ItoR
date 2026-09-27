import { useEffect, useState, type ReactNode } from 'react';

import { CustomToast } from './CustomToast';
import { ToastContext, type Toast } from './toastContext';

type ToastProviderProps = {
  children: ReactNode;
};

/** @returns 앱 전역에서 호출한 토스트를 최상단 중앙에 표시하는 Provider */
export function ToastProvider({ children }: ToastProviderProps) {
  const [toast, setToast] = useState<Toast | null>(null);

  useEffect(() => {
    if (!toast) {
      return;
    }

    const timeoutId = window.setTimeout(() => setToast(null), 3000);

    return () => window.clearTimeout(timeoutId);
  }, [toast]);

  function showToast(nextToast: Toast) {
    setToast(nextToast);
  }

  function hideToast() {
    setToast(null);
  }

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}

      {toast ? (
        <div className="fixed left-1/2 top-[137px] z-[60] -translate-x-1/2">
          <CustomToast variant={toast.variant} message={toast.message} />
        </div>
      ) : null}
    </ToastContext.Provider>
  );
}
