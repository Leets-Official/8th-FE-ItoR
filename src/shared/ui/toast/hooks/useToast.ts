import { useContext } from 'react';

import { ToastContext } from '../toastContext';

/**
 * 가장 가까운 `ToastProvider`의 토스트 제어 함수를 가져옵니다.
 * `showToast({ variant, message })`로 표시하고 `hideToast()`로 즉시 숨길 수 있습니다.
 */
export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error('useToast는 ToastProvider 내부에서 사용해야 합니다.');
  }

  return context;
}
