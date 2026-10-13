import type { ReactNode } from 'react';

import { Link } from 'react-router';

import gitlogLogo from '@/shared/assets/images/gitlog-logo.svg';
import { cn } from '@/shared/utils/cn';

interface PageHeaderProps {
  menu: ReactNode;
  actions?: ReactNode;
  className?: string;
}

export function PageHeader({ menu, actions, className }: PageHeaderProps) {
  return (
    <header
      className={cn('flex h-14 w-full items-center justify-between bg-white px-4', className)}
    >
      <div className="flex items-center gap-3">
        {menu}
        <Link to="/" className="flex items-center" aria-label="Gitlog 홈">
          <img src={gitlogLogo} alt="GITLOG" className="h-5 w-auto" />
        </Link>
      </div>
      <div className="flex items-center gap-2">{actions}</div>
    </header>
  );
}
