import type { HTMLAttributes } from 'react';

import { cn } from '@/shared/utils/cn';

interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  level?: 1 | 2 | 3;
  size?: 'display' | 'title';
}

export function Heading({ level = 2, size = 'title', className, ...props }: HeadingProps) {
  const Tag = `h${level}` as const;
  return (
    <Tag
      className={cn(
        'font-heading font-medium text-foreground',
        size === 'display' ? 'text-[32px] leading-tight' : 'text-base',
        className,
      )}
      {...props}
    />
  );
}

interface TextProps extends HTMLAttributes<HTMLParagraphElement> {
  muted?: boolean;
  lineClamp?: 1 | 2 | 3;
}

const lineClampClasses = {
  1: 'line-clamp-1',
  2: 'line-clamp-2',
  3: 'line-clamp-3',
};

export function Text({ className, muted = false, lineClamp, ...props }: TextProps) {
  return (
    <p
      className={cn(
        'text-sm',
        muted ? 'text-muted-foreground' : 'text-neutral-700',
        lineClamp !== undefined && lineClampClasses[lineClamp],
        className,
      )}
      {...props}
    />
  );
}
