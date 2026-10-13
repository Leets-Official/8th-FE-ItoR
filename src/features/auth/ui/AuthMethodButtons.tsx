import type { ComponentProps } from 'react';

import { KakaoIcon } from '@/shared/assets/icons';
import { Button } from '@/shared/ui/primitives/button';
import { cn } from '@/shared/utils/cn';

export function EmailAuthButton({ className, ...props }: ComponentProps<typeof Button>) {
  return (
    <Button
      {...props}
      type={props.type ?? 'button'}
      variant={null}
      className={cn(
        'h-11 w-full rounded-md bg-gitlog-action px-3.5 text-sm font-normal text-white hover:bg-gitlog-action/90',
        className,
      )}
    />
  );
}

interface KakaoAuthButtonProps {
  children: string;
  onClick: () => void;
}

export function KakaoAuthButton({ children, onClick }: KakaoAuthButtonProps) {
  return (
    <Button
      type="button"
      variant={null}
      onClick={onClick}
      className="h-11 w-full gap-2 rounded-md bg-kakao-bg px-3.5 text-base font-semibold text-kakao-text hover:bg-kakao-bg/90"
    >
      <KakaoIcon aria-hidden="true" className="size-4" />
      {children}
    </Button>
  );
}

export function AuthDivider({ dark = false }: { dark?: boolean }) {
  return (
    <div className="flex h-7 items-center gap-2 px-2 text-xs leading-5 text-neutral-400">
      <span className={cn('h-px flex-1', dark ? 'bg-zinc-800' : 'bg-neutral-100')} />
      <span>{dark ? 'SNS' : '또는'}</span>
      <span className={cn('h-px flex-1', dark ? 'bg-zinc-800' : 'bg-neutral-100')} />
    </div>
  );
}
