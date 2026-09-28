import type { ReactNode } from 'react';

import { ProfileAvatar } from '@/shared/ui/ProfileAvatar';
import { cn } from '@/shared/utils/cn';

interface ProfileCardProps {
  title: string;
  description?: string;
  avatarAlt: string;
  avatarSrc?: string;
  actions?: ReactNode;
  footer?: ReactNode;
  className?: string;
}

export function ProfileCard({
  title,
  description,
  avatarAlt,
  avatarSrc,
  actions,
  footer,
  className,
}: ProfileCardProps) {
  return (
    <section className={cn('flex min-h-80 flex-col bg-white p-4', className)} aria-label={title}>
      <ProfileAvatar src={avatarSrc} alt={avatarAlt} size="sm" />
      <h2 className="mt-3 text-sm font-medium text-neutral-950">{title}</h2>
      {description && <p className="mt-1 text-xs text-neutral-500">{description}</p>}
      {actions && <div className="mt-3 flex flex-wrap gap-2">{actions}</div>}
      {footer && <div className="mt-auto flex justify-end gap-2 pt-4">{footer}</div>}
    </section>
  );
}
