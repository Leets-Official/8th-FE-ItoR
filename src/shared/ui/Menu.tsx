import type { ReactNode } from 'react';
import { DropdownMenu as DropdownMenuPrimitive } from 'radix-ui';
import { cn } from '@/shared/lib/utils';
import { IconButton } from './IconButton';
import type { IconName } from './Icon';

interface MenuProps {
  trigger: ReactNode;
  icon: IconName;
  label: string;
  onSelect?: (event: Event) => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
}

// Figma "menu" — 트리거 위쪽에 뜨는 아이콘 하나짜리 메뉴. 아래쪽 꼬리가 트리거 가운데를 가리킨다
export function Menu({ trigger, icon, label, onSelect, open, onOpenChange, className }: MenuProps) {
  return (
    <DropdownMenuPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DropdownMenuPrimitive.Trigger asChild>{trigger}</DropdownMenuPrimitive.Trigger>
      <DropdownMenuPrimitive.Portal>
        <DropdownMenuPrimitive.Content
          side="top"
          className={cn(
            'z-50 flex h-12 w-[72px] items-center rounded-sm bg-white px-4 py-1 drop-shadow-[0_2px_8px_rgba(0,0,0,0.1)] data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0',
            className,
          )}
        >
          <DropdownMenuPrimitive.Item asChild onSelect={onSelect}>
            <IconButton icon={icon} label={label} />
          </DropdownMenuPrimitive.Item>
          <DropdownMenuPrimitive.Arrow width={16} height={8} className="fill-white" />
        </DropdownMenuPrimitive.Content>
      </DropdownMenuPrimitive.Portal>
    </DropdownMenuPrimitive.Root>
  );
}
