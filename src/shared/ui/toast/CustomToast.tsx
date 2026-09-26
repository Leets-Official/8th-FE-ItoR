import { Icon } from '@/shared/assets/icons/Icon';
import { DoneIcon, ErrorOutlineIcon } from '@/shared/assets/icons/icons';

type CustomToastProps = {
  variant: 'positive' | 'negative';
  message: string;
};

const toastStyles = {
  positive: {
    icon: DoneIcon,
    color: 'border-positive text-positive',
  },
  negative: {
    icon: ErrorOutlineIcon,
    color: 'border-negative text-negative',
  },
};

/**
 * variant: positive 또는 negative 토스트 형태
 * message: 표시할 문구
 * @returns 상태에 맞는 아이콘과 문구를 표시하는 토스트
 */
export function CustomToast({ variant, message }: CustomToastProps) {
  const { icon, color } = toastStyles[variant];

  return (
    <div
      role={variant === 'negative' ? 'alert' : 'status'}
      className={`flex h-10 w-fit items-center justify-center gap-1 rounded-[25px] border bg-[rgba(255,255,255,0.9)] px-3 py-2 backdrop-blur-[4px] ${color}`}
    >
      <Icon source={icon} size="icon-24" />
      <span className="text-14-regular">{message}</span>
    </div>
  );
}
