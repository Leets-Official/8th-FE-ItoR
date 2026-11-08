import { lazy, Suspense, type Ref } from 'react';

import { useLocation, useMatch } from 'react-router';

import type { LoginHandler } from '@/features/auth/model/login';
import { ReorderIcon } from '@/shared/assets/icons';
import { IconButton } from '@/shared/ui/IconButton';
import { GitlogButton } from '@/shared/ui/GitlogButton';
import { PageHeader } from '@/shared/ui/PageHeader';

import { HomeHeaderActions } from './HomeHeaderActions';
import { WriteHeaderActions } from './WriteHeaderActions';
import { ProfileHeaderActions } from './ProfileHeaderActions';

const PostHeaderActions = lazy(() =>
  import('./PostHeaderActions').then((module) => ({ default: module.PostHeaderActions })),
);

const LoginDialog = lazy(() =>
  import('@/features/auth/ui/LoginDialog').then((module) => ({ default: module.LoginDialog })),
);

interface AppHeaderProps {
  signedIn: boolean;
  loginOpen: boolean;
  hasOpenedLogin: boolean;
  onLoginOpenChange: (open: boolean) => void;
  onLogin: LoginHandler;
  onWrite: () => void;
  canManagePost: boolean;
  postPending: boolean;
  profilePending: boolean;
  onEditPost: () => void;
  onDeletePost: () => Promise<boolean>;
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
  menuButtonRef: Ref<HTMLButtonElement>;
}

export function AppHeader({
  signedIn,
  loginOpen,
  hasOpenedLogin,
  onLoginOpenChange,
  onLogin,
  onWrite,
  canManagePost,
  postPending,
  profilePending,
  onEditPost,
  onDeletePost,
  sidebarOpen,
  onToggleSidebar,
  menuButtonRef,
}: AppHeaderProps) {
  const { pathname } = useLocation();
  const editMatch = useMatch('/posts/:postId/edit');
  const isWritingPage = pathname === '/posts/new' || editMatch !== null;
  const isPostPage = useMatch('/posts/:postId') !== null && !isWritingPage;
  const isBlogPage = pathname === '/' || isPostPage || isWritingPage;
  const isSignupPage = pathname === '/mypage/signup' || pathname.startsWith('/mypage/signup/');
  const isProfilePage = pathname === '/mypage/settings' || pathname === '/mypage/settings/edit';

  return (
    <PageHeader
      showLogo={!sidebarOpen}
      className={
        isBlogPage || isProfilePage
          ? `h-18 bg-white/90 py-4 font-auth backdrop-blur-[2px] ${isWritingPage || isProfilePage ? 'border-b border-neutral-100' : ''}`
          : undefined
      }
      menu={
        !sidebarOpen && (
          <IconButton
            ref={menuButtonRef}
            label="메뉴 열기"
            aria-expanded={false}
            onClick={onToggleSidebar}
          >
            <ReorderIcon aria-hidden="true" />
          </IconButton>
        )
      }
      actions={
        <>
          {isWritingPage && signedIn && (
            <WriteHeaderActions editing={editMatch !== null} pending={postPending} />
          )}
          {pathname === '/' && <HomeHeaderActions onWrite={onWrite} />}
          {isProfilePage && signedIn && (
            <ProfileHeaderActions editing={pathname.endsWith('/edit')} pending={profilePending} />
          )}
          {isPostPage && (
            <Suspense
              fallback={
                <span role="status" className="sr-only">
                  게시글 메뉴를 불러오고 있습니다.
                </span>
              }
            >
              <PostHeaderActions
                key={pathname}
                canManage={canManagePost}
                pending={postPending}
                onEdit={onEditPost}
                onDelete={onDeletePost}
              />
            </Suspense>
          )}
          {!isBlogPage && !isSignupPage && !isProfilePage && (
            <GitlogButton
              aria-haspopup="dialog"
              aria-expanded={loginOpen}
              onClick={() => onLoginOpenChange(true)}
            >
              로그인
            </GitlogButton>
          )}
          {/* 첫 열기 후에는 닫기 애니메이션과 포커스 복원을 위해 마운트를 유지한다. */}
          {hasOpenedLogin && (
            <Suspense
              fallback={
                <span role="status" className="text-xs text-neutral-600">
                  로그인 화면 로딩 중...
                </span>
              }
            >
              <LoginDialog open={loginOpen} onOpenChange={onLoginOpenChange} onLogin={onLogin} />
            </Suspense>
          )}
        </>
      }
    />
  );
}
