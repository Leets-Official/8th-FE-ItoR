import type { ReactElement } from 'react';

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
  appearance?: 'floating' | 'flat';
}

export function ActionMenu({ label, items, trigger, appearance = 'floating' }: ActionMenuProps) {
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
        align="start"
        className={cn(
          'min-w-36 bg-white p-1 text-neutral-900',
          appearance === 'flat' ? 'rounded-none shadow-none ring-0' : 'rounded-sm shadow-md',
        )}
      >
        {items.map((item) => (
          <DropdownMenuItem
            key={item.id}
            disabled={item.disabled}
            variant={item.destructive ? 'destructive' : 'default'}
            onSelect={item.onSelect}
            className={cn('min-h-9 px-2 text-xs', appearance === 'flat' && 'rounded-none')}
          >
            {item.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
