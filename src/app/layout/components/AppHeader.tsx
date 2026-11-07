import { lazy, Suspense, useState, type ReactNode } from 'react';
import { useMatches, useNavigate, useSearch } from '@tanstack/react-router';

import { useAuth } from '@/shared/auth/hooks/useAuth';
import type { AppHeaderVariant } from '@/app/layout/model/header';
import { ReorderIcon } from '@/shared/assets/icons/icons';
import { IconButton } from '@/shared/ui/button/IconButton';
import { Logo } from '@/shared/ui/logo/Logo';

const DetailHeaderActions = lazy(() =>
  import('@/features/detail/components/DetailHeaderActions').then((module) => ({
    default: module.DetailHeaderActions,
  })),
);
const LoginDialog = lazy(() =>
  import('@/features/main/components/LoginDialog').then((module) => ({
    default: module.LoginDialog,
  })),
);
const MainHeaderActions = lazy(() =>
  import('@/features/main/components/MainHeaderActions').then((module) => ({
    default: module.MainHeaderActions,
  })),
);
const ProfileEditHeaderActions = lazy(() =>
  import('@/features/my/edit/components/ProfileEditHeaderActions').then((module) => ({
    default: module.ProfileEditHeaderActions,
  })),
);
const WriteHeaderActions = lazy(() =>
  import('@/features/write/components/WriteHeaderActions').then((module) => ({
    default: module.WriteHeaderActions,
  })),
);
const NavigationDrawer = lazy(() =>
  import('./NavigationDrawer').then((module) => ({ default: module.NavigationDrawer })),
);

type HeaderActionProps = {
  variant: AppHeaderVariant;
  formId?: string;
  onLoginRequired: () => void;
};

function HeaderActions({ variant, formId, onLoginRequired }: HeaderActionProps): ReactNode {
  if (variant === 'main') {
    return <MainHeaderActions onLoginRequired={onLoginRequired} />;
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
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);
  const navigate = useNavigate();
  const search = useSearch({ strict: false }) as { loginRequired?: boolean };
  const { auth, logout: clearAuth } = useAuth();
  const header = useMatches({
    select: (matches) => ({
      variant: matches.at(-1)?.staticData.headerVariant ?? 'register',
      formId: matches.at(-1)?.staticData.headerFormId,
    }),
  });
  const hasNavigation = header.variant === 'main' || header.variant === 'profileEdit';
  const isLoginDialogVisible = isLoginDialogOpen || Boolean(search.loginRequired);

  function openNavigation() {
    setIsNavigationOpen(true);
  }

  function closeNavigation() {
    setIsNavigationOpen(false);
  }

  function openLoginDialog() {
    closeNavigation();
    setIsLoginDialogOpen(true);
  }

  function closeLoginDialog() {
    setIsLoginDialogOpen(false);

    if (search.loginRequired) {
      void navigate({ to: '/', search: {}, replace: true });
    }
  }

  async function openMyPage() {
    closeNavigation();
    await navigate({ to: '/my' });
  }

  async function openWritePage() {
    closeNavigation();
    await navigate({ to: '/write' });
  }

  async function logout() {
    clearAuth();
    await navigate({ to: '/' });
  }

  const session = {
    isLoggedIn: Boolean(auth),
    nickname: auth?.nickname ?? '',
    introduction: auth?.introduction ?? '',
    profilePicture: auth?.profilePicture ?? undefined,
  };

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

        <Suspense fallback={null}>
          <HeaderActions
            variant={header.variant}
            formId={header.formId}
            onLoginRequired={openLoginDialog}
          />
        </Suspense>
      </header>

      {hasNavigation && isNavigationOpen ? (
        <Suspense fallback={null}>
          <NavigationDrawer
            isOpen={isNavigationOpen}
            session={session}
            onLoginRequired={openLoginDialog}
            onMyPageOpen={openMyPage}
            onWriteOpen={openWritePage}
            onLogout={logout}
            onClose={closeNavigation}
          />
        </Suspense>
      ) : null}

      {isLoginDialogVisible ? (
        <Suspense fallback={null}>
          <LoginDialog onClose={closeLoginDialog} />
        </Suspense>
      ) : null}
    </>
  );
}
