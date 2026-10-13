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
        'mx-auto flex min-h-10 w-max max-w-full items-center gap-1 rounded-full border bg-white/90 px-3 py-2 font-auth text-sm leading-6 backdrop-blur-[2px]',
        isError
          ? 'border-gitlog-danger text-gitlog-danger'
          : 'border-gitlog-success text-gitlog-success',
      )}
    >
      <Icon className="size-6 shrink-0 [&_path]:fill-current" aria-hidden="true" />
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
