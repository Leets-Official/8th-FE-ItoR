import { createContext } from 'react';
import type { ToastType } from '@/types/toast';

export interface ToastContextValue {
  showToast: (type: ToastType, message: string) => void;
}

export const ToastContext = createContext<ToastContextValue | null>(null);
