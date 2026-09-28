import type { ButtonHTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

type ButtonVariant =
  | 'outline-point'
  | 'outline-gray'
  | 'solid-ink'
  | 'solid-point'
  | 'kakao'
  | 'danger'
  | 'white'
  | 'text'
  | 'text-strong'
  | 'text-danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
}

const VARIANT_CLASS: Record<ButtonVariant, string> = {
  'outline-point': 'rounded-full border border-point bg-white text-point hover:bg-point-light',
  'outline-gray': 'rounded-full border border-gray-300 bg-white text-gray-500 hover:bg-gray-50',
  'solid-ink': 'rounded-full bg-ink text-white hover:bg-ink/85',
  'solid-point': 'rounded-sm bg-point text-white hover:bg-point/90',
  kakao: 'rounded-sm bg-kakao text-ink hover:brightness-95',
  danger: 'rounded-sm bg-danger text-white hover:bg-danger/90',
  white: 'rounded-sm border border-gray-100 bg-white text-ink hover:bg-gray-50',
  text: 'bg-transparent text-sm text-gray-600 hover:text-ink',
  'text-strong': 'bg-transparent text-sm text-ink hover:text-gray-600',
  'text-danger': 'bg-transparent text-sm text-danger hover:text-danger/70',
};

const SIZE_CLASS: Record<ButtonSize, string> = {
  sm: 'h-7 px-3 text-xs',
  md: 'h-9 px-4 text-sm',
  lg: 'h-11 px-5 text-sm',
};

function Button({
  variant = 'solid-ink',
  size = 'md',
  fullWidth = false,
  type = 'button',
  className,
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex shrink-0 items-center justify-center gap-1.5 font-normal whitespace-nowrap transition-colors',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-point',
        'disabled:cursor-not-allowed disabled:opacity-40',
        VARIANT_CLASS[variant],
        !variant.startsWith('text') && SIZE_CLASS[size],
        fullWidth && 'w-full',
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}

export default Button;
