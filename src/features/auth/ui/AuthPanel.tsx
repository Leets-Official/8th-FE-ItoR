import type { ReactNode } from 'react';

import gitlogLogo from '@/shared/assets/images/gitlog-logo.svg';
import { cn } from '@/shared/utils/cn';

interface AuthPanelProps {
  children: ReactNode;
  dark?: boolean;
}

export function AuthPanel({ children, dark = false }: AuthPanelProps) {
  return (
    <div className="mx-auto flex w-full max-w-[782px] flex-col items-center gap-8 py-12 font-auth sm:flex-row sm:gap-0 sm:py-20">
      <div className="flex w-full min-w-0 flex-1 flex-col items-center">
        <div className="flex h-40 w-full max-w-80 items-center justify-center">
          <img
            src={gitlogLogo}
            alt="GITLOG"
            className={cn('h-40 w-80 max-w-full object-contain', dark && 'invert')}
          />
        </div>
        <p className="flex min-h-11 w-full max-w-80 items-center justify-center px-4 py-3 text-center text-sm leading-6 font-light text-neutral-400">
          You can make anything by writing
        </p>
      </div>
      <div className="flex w-full min-w-0 flex-1 flex-col items-center px-4">
        <div className="hidden h-8 sm:block" />
        <div className="w-full max-w-80 space-y-2 px-4">{children}</div>
      </div>
    </div>
  );
}
