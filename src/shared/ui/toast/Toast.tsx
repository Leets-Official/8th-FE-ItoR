import { Icon } from '@/shared/assets/icons/Icon';
import { DoneIcon, ErrorOutlineIcon } from '@/shared/assets/icons/icons';

export type ToastProps = {
  /** 성공 알림은 `positive`, 오류 알림은 `negative`를 사용합니다. */
  variant: 'positive' | 'negative';
  /** 토스트에 표시할 짧은 알림 문구입니다. */
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

/** 상태에 맞는 아이콘, 색상과 접근성 role을 적용한 토스트 메시지입니다. */
export function Toast({ variant, message }: ToastProps) {
  const { icon, color } = toastStyles[variant];

  return (
    <div
      role={variant === 'negative' ? 'alert' : 'status'}
      className={`flex h-10 w-fit items-center justify-center gap-1 rounded-[25px] border bg-surface-overlay px-3 py-2 backdrop-blur-[4px] ${color}`}
    >
      <Icon source={icon} size="icon-24" />
      <span className="text-14-regular">{message}</span>
    </div>
  );
}
