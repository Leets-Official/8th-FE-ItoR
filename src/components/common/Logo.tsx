import logoImage from '@/assets/logo.png';
import { cn } from '@/utils/cn';

interface LogoProps {
  size?: 'sm' | 'lg';
  /** 어두운 배경(로그인 모달) 위에서는 흰색 로고로 바꾼다. */
  isInverted?: boolean;
  className?: string;
}

function Logo({ size = 'sm', isInverted = false, className }: LogoProps) {
  return (
    <img
      src={logoImage}
      alt="GITLOG"
      className={cn(
        'select-none',
        size === 'sm' ? 'h-5 w-auto' : 'h-14 w-auto',
        isInverted && 'invert',
        className,
      )}
    />
  );
}

export default Logo;
