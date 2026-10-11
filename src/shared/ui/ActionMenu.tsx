import type { ReactElement } from 'react';

import { DropdownMenu as DropdownMenuPrimitive } from 'radix-ui';

import { MoreVertIcon } from '@/shared/assets/icons';
import { Button } from '@/shared/ui/primitives/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/ui/primitives/dropdown-menu';
import { cn } from '@/shared/utils/cn';

interface ActionMenuItem {
  id: string;
  label: string;
  onSelect: () => void;
  destructive?: boolean;
  disabled?: boolean;
}

interface ActionMenuProps {
  label: string;
  items: ActionMenuItem[];
  trigger?: ReactElement;
  appearance?: 'floating' | 'flat' | 'post';
  onCloseAutoFocus?: (event: Event) => void;
}

export function ActionMenu({
  label,
  items,
  trigger,
  appearance = 'floating',
  onCloseAutoFocus,
}: ActionMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {trigger ?? (
          <Button type="button" variant="ghost" size="icon" aria-label={label}>
            <MoreVertIcon aria-hidden="true" />
          </Button>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        onCloseAutoFocus={onCloseAutoFocus}
        align={appearance === 'post' ? 'end' : 'start'}
        sideOffset={appearance === 'post' ? 8 : 4}
        className={cn(
          'min-w-36 bg-white p-1 text-neutral-900',
          appearance === 'flat' ? 'rounded-none shadow-none ring-0' : 'rounded-sm shadow-md',
          appearance === 'post' &&
            'w-40 min-w-40 overflow-visible px-0 py-1 font-auth text-black shadow-[0px_2px_8px_0px_rgba(0,0,0,0.10)] ring-0',
        )}
      >
        {items.map((item) => (
          <DropdownMenuItem
            key={item.id}
            disabled={item.disabled}
            variant={item.destructive ? 'destructive' : 'default'}
            onSelect={item.onSelect}
            className={cn(
              'min-h-9 px-2 text-xs',
              appearance === 'flat' && 'rounded-none',
              appearance === 'post' &&
                'rounded-none px-3 pt-2 pb-3 text-sm leading-6 font-normal data-[variant=destructive]:text-gitlog-danger data-[variant=destructive]:focus:text-gitlog-danger',
            )}
          >
            {item.label}
          </DropdownMenuItem>
        ))}
        {appearance === 'post' && (
          <DropdownMenuPrimitive.Arrow width={16} height={8} className="fill-white" />
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
