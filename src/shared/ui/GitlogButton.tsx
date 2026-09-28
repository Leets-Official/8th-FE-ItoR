import type { ReactNode } from 'react';

import { Button } from '@/shared/ui/primitives/button';
import { cn } from '@/shared/utils/cn';

type Appearance = 'outline' | 'muted' | 'solid' | 'text';

interface GitlogButtonProps extends Omit<
  React.ComponentProps<typeof Button>,
  'variant' | 'asChild'
> {
  appearance?: Appearance;
  icon?: ReactNode;
}

const appearances: Record<Appearance, string> = {
  outline:
    'rounded-full border border-gitlog-action bg-white text-gitlog-action hover:bg-blue-50 hover:text-gitlog-action',
  muted:
    'rounded-full border border-neutral-300 bg-neutral-100 text-neutral-500 hover:bg-neutral-200 hover:text-neutral-700',
  solid: 'rounded-full bg-neutral-950 text-white hover:bg-neutral-800 hover:text-white',
  text: 'rounded-none bg-transparent text-neutral-500 hover:bg-transparent hover:text-neutral-900',
};

export function GitlogButton({
  appearance = 'outline',
  className,
  icon,
  children,
  type = 'button',
  ...props
}: GitlogButtonProps) {
  return (
    <Button
      type={type}
      variant="ghost"
      className={cn('h-9 gap-1.5 px-3 text-xs font-normal', appearances[appearance], className)}
      {...props}
    >
      {icon}
      {children}
    </Button>
  );
}
