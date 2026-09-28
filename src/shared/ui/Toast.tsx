import type { ReactNode } from 'react';
import { Icon, type IconName } from './Icon';
import { cn } from '@/shared/lib/utils';

export type ToastType = 'negative' | 'positive';

const TOAST_STYLE: Record<ToastType, { icon: IconName; className: string }> = {
  negative: { icon: 'error_outline', className: 'border-negative text-negative' },
  positive: { icon: 'done', className: 'border-positive text-positive' },
};

interface ToastProps {
  type: ToastType;
  children: ReactNode;
  className?: string;
}

export function Toast({ type, children, className }: ToastProps) {
  const style = TOAST_STYLE[type];

  return (
    <div
      role={type === 'negative' ? 'alert' : 'status'}
      className={cn(
        'inline-flex h-10 items-center gap-1 rounded-full border bg-white/90 px-3 text-14 backdrop-blur-[2px]',
        style.className,
        className,
      )}
    >
      <Icon name={style.icon} />
      {children}
    </div>
  );
}
