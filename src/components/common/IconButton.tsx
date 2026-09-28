import type { ButtonHTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** 아이콘만 있는 버튼은 스크린 리더가 읽을 이름이 꼭 필요하다. */
  'aria-label': string;
}

function IconButton({ type = 'button', className, children, ...rest }: IconButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex size-8 shrink-0 items-center justify-center rounded-sm text-ink transition-colors hover:bg-gray-50',
        'focus-visible:outline-2 focus-visible:outline-point',
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}

export default IconButton;
