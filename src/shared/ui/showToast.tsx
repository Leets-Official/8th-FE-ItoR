import type { ReactNode } from 'react';
import { toast, type ExternalToast } from 'sonner';
import { Toast, type ToastType } from './Toast';

export function showToast(type: ToastType, message: ReactNode, options?: ExternalToast) {
  return toast.custom(() => <Toast type={type}>{message}</Toast>, options);
}
