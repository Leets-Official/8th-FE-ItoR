import { CircleAlert, Check } from 'lucide-react';
import type { ToastType } from '@/types/toast';
import { cn } from '@/utils/cn';

interface ToastProps {
  type: ToastType;
  message: string;
  onClose: () => void;
}

const TOAST_STYLE: Record<ToastType, { className: string; icon: typeof Check }> = {
  success: { className: 'border-success text-success', icon: Check },
  error: { className: 'border-danger text-danger', icon: CircleAlert },
};

/** 화면 아래에 잠깐 떠서 성공/실패 결과를 알려준다. 애니메이션이 끝나면 스스로 사라진다. */
function Toast({ type, message, onClose }: ToastProps) {
  const { className, icon: Icon } = TOAST_STYLE[type];

  return (
    <div
      role={type === 'error' ? 'alert' : 'status'}
      onAnimationEnd={onClose}
      className={cn(
        'fixed bottom-10 left-1/2 z-[60] flex animate-toast items-center gap-1.5 rounded-full border bg-white px-4 py-2 text-sm shadow-sm',
        className,
      )}
    >
      <Icon size={16} aria-hidden />
      {message}
    </div>
  );
}

export default Toast;
