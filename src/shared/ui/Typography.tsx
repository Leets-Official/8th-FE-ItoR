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
        'font-medium text-neutral-950',
        size === 'display' ? 'text-[32px] leading-tight' : 'text-base leading-6',
        className,
      )}
      {...props}
    />
  );
}

interface TextProps extends HTMLAttributes<HTMLParagraphElement> {
  muted?: boolean;
  lineClamp?: 2;
}

export function Text({ className, muted = false, lineClamp, ...props }: TextProps) {
  return (
    <p
      className={cn(
        'text-sm leading-5',
        muted ? 'text-neutral-500' : 'text-neutral-700',
        lineClamp === 2 && 'line-clamp-2',
        className,
      )}
      {...props}
    />
  );
}
