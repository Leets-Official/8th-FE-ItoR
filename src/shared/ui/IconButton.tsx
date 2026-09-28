import type { ComponentProps } from 'react';

import { Button } from '@/shared/ui/primitives/button';

type IconButtonProps = Omit<ComponentProps<typeof Button>, 'size' | 'variant' | 'asChild'> & {
  label: string;
  size?: 'sm' | 'md' | 'lg';
};

export function IconButton({ label, size = 'md', ...props }: IconButtonProps) {
  return (
    <Button
      {...props}
      type={props.type ?? 'button'}
      variant="ghost"
      size={size === 'sm' ? 'icon-sm' : size === 'lg' ? 'icon-lg' : 'icon'}
      aria-label={label}
    />
  );
}
