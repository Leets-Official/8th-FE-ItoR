import { useLocation, useNavigate } from 'react-router';

import { LoginDialog } from '@/features/auth/ui/LoginDialog';
import { ReorderIcon } from '@/shared/assets/icons';
import { ActionMenu } from '@/shared/ui/ActionMenu';
import { IconButton } from '@/shared/ui/IconButton';
import { PageHeader } from '@/shared/ui/PageHeader';

import { HomeHeaderActions } from './HomeHeaderActions';
import { PostHeaderActions } from './PostHeaderActions';
import { WriteHeaderActions } from './WriteHeaderActions';

interface AppHeaderProps {
  signedIn: boolean;
  loginOpen: boolean;
  onLoginOpenChange: (open: boolean) => void;
  onLogin: () => void;
  onOpenLogin: () => void;
  onWrite: () => void;
}

export function AppHeader({
  signedIn,
  loginOpen,
  onLoginOpenChange,
  onLogin,
  onOpenLogin,
  onWrite,
}: AppHeaderProps) {
  const navigate = useNavigate();
  const { pathname, search } = useLocation();
  const isWritingPage = pathname === '/posts/new';
  const isPostPage = pathname.startsWith('/posts/') && !isWritingPage;
  const isBlogPage = pathname === '/' || isPostPage || isWritingPage;

  return (
    <PageHeader
      className={
        isBlogPage
          ? `h-18 bg-white/90 py-4 font-auth backdrop-blur-[2px] ${isWritingPage ? 'border-b border-neutral-100' : ''}`
          : undefined
      }
      menu={
        <ActionMenu
          label="메뉴 열기"
          trigger={
            <IconButton label="메뉴 열기">
              <ReorderIcon aria-hidden="true" />
            </IconButton>
          }
          items={[
            { id: 'home', label: '홈', onSelect: () => navigate('/') },
            { id: 'write', label: '깃로그 쓰기', onSelect: onWrite },
            { id: 'signup', label: '회원가입', onSelect: () => navigate('/mypage/signup') },
          ]}
        />
      }
      actions={
        <>
          {isWritingPage && signedIn && <WriteHeaderActions />}
          {pathname === '/' && <HomeHeaderActions onWrite={onWrite} />}
          {isPostPage && (
            <PostHeaderActions
              onBackToList={() => navigate({ pathname: '/', search })}
              onLogin={onOpenLogin}
            />
          )}
          <LoginDialog
            open={loginOpen}
            onOpenChange={onLoginOpenChange}
            onLogin={onLogin}
            trigger={isBlogPage ? null : undefined}
          />
        </>
      }
    />
  );
}
