import defaultProfileImage from '@/assets/default-profile.png';
import { cn } from '@/utils/cn';

type AvatarSize = 'xs' | 'sm' | 'md' | 'lg';

interface AvatarProps {
  src: string | null;
  /** 옆에 이름이 같이 보이는 경우처럼 장식용이면 빈 문자열을 넘긴다. */
  alt: string;
  size?: AvatarSize;
  className?: string;
}

const SIZE_CLASS: Record<AvatarSize, string> = {
  xs: 'size-5',
  sm: 'size-6',
  md: 'size-10',
  lg: 'size-16',
};

function Avatar({ src, alt, size = 'md', className }: AvatarProps) {
  return (
    <img
      src={src ?? defaultProfileImage}
      alt={alt}
      loading="lazy"
      decoding="async"
      className={cn('shrink-0 rounded-full bg-gray-100 object-cover', SIZE_CLASS[size], className)}
    />
  );
}

export default Avatar;
