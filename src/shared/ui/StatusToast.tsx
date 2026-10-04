import { toast } from 'sonner';

import { DoneIcon, ErrorOutlineIcon } from '@/shared/assets/icons';
import { cn } from '@/shared/utils/cn';

type ToastStatus = 'error' | 'success';

interface StatusToastProps {
  status: ToastStatus;
  message: string;
}

export function StatusToast({ status, message }: StatusToastProps) {
  const isError = status === 'error';
  const Icon = isError ? ErrorOutlineIcon : DoneIcon;

  return (
    <div
      role={isError ? 'alert' : 'status'}
      className={cn(
        'inline-flex min-h-9 items-center gap-1.5 rounded-full border bg-white px-3 py-1.5 text-xs shadow-sm',
        isError
          ? 'border-gitlog-danger text-gitlog-danger'
          : 'border-gitlog-success text-gitlog-success',
      )}
    >
      <Icon className="size-4" aria-hidden="true" />
      <span>{message}</span>
    </div>
  );
}

export const notify = {
  error(message: string) {
    toast.custom(() => <StatusToast status="error" message={message} />);
  },
  success(message: string) {
    toast.custom(() => <StatusToast status="success" message={message} />);
  },
};
