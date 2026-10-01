import type { ComponentProps } from 'react';

import { Button } from '@/shared/ui/primitives/button';

type IconButtonProps = Omit<ComponentProps<typeof Button>, 'size' | 'variant' | 'asChild'> & {
  label: string;
  size?: 'sm' | 'md' | 'lg';
};

const iconButtonSizes = {
  sm: 'icon-sm',
  md: 'icon',
  lg: 'icon-lg',
} as const;

export function IconButton({ label, size = 'md', ...props }: IconButtonProps) {
  return (
    <Button
      {...props}
      type={props.type ?? 'button'}
      variant="ghost"
      size={iconButtonSizes[size]}
      aria-label={label}
    />
  );
}
