import type { ComponentProps } from 'react';
import { cn } from '@/shared/lib/utils';
import { Icon, type IconName } from './Icon';

interface IconButtonProps extends ComponentProps<'button'> {
  icon: IconName;
  label: string;
  pressed?: boolean;
}

// DropdownMenuTrigger 등의 asChild로 쓰이면 메뉴가 열린 동안(data-state=open) 눌림 상태로 표시된다
export function IconButton({
  icon,
  label,
  pressed = false,
  type = 'button',
  className,
  ...props
}: IconButtonProps) {
  return (
    <button
      type={type}
      aria-label={label}
      className={cn(
        'inline-flex cursor-pointer rounded-sm text-gray-20 outline-none',
        pressed
          ? 'bg-gray-90'
          : 'hover:bg-gray-90 focus-visible:bg-gray-90 active:bg-gray-90 data-highlighted:bg-gray-90 data-[state=open]:bg-gray-90',
        className,
      )}
      {...props}
    >
      <Icon name={icon} size={40} />
    </button>
  );
}
