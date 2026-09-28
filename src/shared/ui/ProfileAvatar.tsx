import type { ImgHTMLAttributes } from 'react';

import defaultProfileAvatar from '@/shared/assets/images/profile-avatar.png';
import { cn } from '@/shared/utils/cn';

interface ProfileAvatarProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'alt' | 'src'> {
  alt: string;
  src?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const avatarSizes = {
  sm: 'size-6',
  md: 'size-12',
  lg: 'size-[72px]',
  xl: 'size-[104px]',
};

export function ProfileAvatar({ alt, src, size = 'md', className, ...props }: ProfileAvatarProps) {
  const classes = cn(
    'inline-flex shrink-0 overflow-hidden rounded-full',
    avatarSizes[size],
    className,
  );

  return (
    <span className={classes}>
      <img
        {...props}
        src={src ?? defaultProfileAvatar}
        alt={alt}
        loading={props.loading ?? 'lazy'}
        className={cn('size-full object-cover', !src && 'scale-[1.34]')}
      />
    </span>
  );
}
