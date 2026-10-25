import { useState, type ReactNode } from 'react';
import { useLocation, useMatches, useNavigate } from '@tanstack/react-router';

import { APP_SESSION_MOCK } from '@/app/layout/mocks/session.mock';
import type { AppHeaderVariant } from '@/app/layout/model/header';
import { DetailHeaderActions } from '@/features/detail/components/DetailHeaderActions';
import { MainHeaderActions } from '@/features/main/components/MainHeaderActions';
import { ProfileEditHeaderActions } from '@/features/my/edit/components/ProfileEditHeaderActions';
import { WriteHeaderActions } from '@/features/write/components/WriteHeaderActions';
import { ReorderIcon } from '@/shared/assets/icons/icons';
import { IconButton } from '@/shared/ui/button/IconButton';
import { Logo } from '@/shared/ui/logo/Logo';

import { NavigationDrawer } from './NavigationDrawer';

type HeaderActionProps = {
  variant: AppHeaderVariant;
  formId?: string;
  isMainPage: boolean;
};

function HeaderActions({ variant, formId, isMainPage }: HeaderActionProps): ReactNode {
  if (variant === 'main') {
    return <MainHeaderActions enabled={isMainPage} />;
  }

  if (variant === 'detail') {
    return <DetailHeaderActions />;
  }

  if (variant === 'write') {
    return <WriteHeaderActions formId={formId} />;
  }

  if (variant === 'profileEdit') {
    return <ProfileEditHeaderActions formId={formId} />;
  }

  return null;
}

export function AppHeader() {
  const [isNavigationOpen, setIsNavigationOpen] = useState(false);
  const navigate = useNavigate();
  const pathname = useLocation({ select: (location) => location.pathname });
  const header = useMatches({
    select: (matches) => ({
      variant: matches.at(-1)?.staticData.headerVariant ?? 'register',
      formId: matches.at(-1)?.staticData.headerFormId,
    }),
  });
  const hasNavigation = header.variant === 'main' || header.variant === 'profileEdit';

  function openNavigation() {
    setIsNavigationOpen(true);
  }

  function closeNavigation() {
    setIsNavigationOpen(false);
  }

  async function logout() {
    await navigate({ to: '/' });
  }

  return (
    <>
      <header className="flex h-fit w-full items-center justify-between bg-surface-overlay py-4 pl-3 pr-4 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <IconButton
            icon={ReorderIcon}
            label="메뉴 열기"
            onClick={hasNavigation ? openNavigation : undefined}
          />
          <Logo />
        </div>

        <HeaderActions
          variant={header.variant}
          formId={header.formId}
          isMainPage={pathname === '/'}
        />
      </header>

      {hasNavigation ? (
        <NavigationDrawer
          isOpen={isNavigationOpen}
          session={APP_SESSION_MOCK}
          onLogout={logout}
          onClose={closeNavigation}
        />
      ) : null}
    </>
  );
}
