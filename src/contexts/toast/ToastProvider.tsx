import { useState, type ReactNode } from 'react';
import Toast from '@/components/common/Toast';
import type { ToastMessage, ToastType } from '@/types/toast';
import { ToastContext } from './ToastContext';

function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const showToast = (type: ToastType, message: string) => {
    setToast({ id: Date.now(), type, message });
  };

  return (
    <ToastContext value={{ showToast }}>
      {children}
      {toast && (
        <Toast
          key={toast.id}
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
    </ToastContext>
  );
}

export default ToastProvider;
