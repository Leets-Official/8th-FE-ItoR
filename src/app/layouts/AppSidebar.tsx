import { useEffect, useRef, useState } from 'react';

import { ClearIcon } from '@/shared/assets/icons';
import type { User } from '@/shared/types/user';
import { ConfirmDialog } from '@/shared/ui/ConfirmDialog';
import { GitlogButton } from '@/shared/ui/GitlogButton';
import { IconButton } from '@/shared/ui/IconButton';
import { ProfileAvatar } from '@/shared/ui/ProfileAvatar';

interface AppSidebarProps {
  user: User | null;
  onClose: () => void;
  onStart: () => void;
  onMyGitlog: () => void;
  onWrite: () => void;
  onSettings: () => void;
  onLogout: () => void;
}

export function AppSidebar({
  user,
  onClose,
  onStart,
  onMyGitlog,
  onWrite,
  onSettings,
  onLogout,
}: AppSidebarProps) {
  const closeButton = useRef<HTMLButtonElement>(null);
  const logoutButton = useRef<HTMLButtonElement>(null);
  const [logoutOpen, setLogoutOpen] = useState(false);

  useEffect(() => {
    closeButton.current?.focus({ preventScroll: true });
  }, []);

  useEffect(() => {
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === 'Escape' && !event.defaultPrevented) onClose();
    }
    document.addEventListener('keydown', closeOnEscape);
    return () => document.removeEventListener('keydown', closeOnEscape);
  }, [onClose]);

  return (
    <>
      <button
        type="button"
        aria-label="메뉴 바깥 영역 닫기"
        tabIndex={-1}
        onClick={onClose}
        className="fixed inset-0 z-30 bg-black/10 sm:hidden"
      />
      <aside
        id="app-sidebar"
        aria-label="마이페이지 미리보기"
        className="fixed inset-y-0 left-0 z-40 flex h-dvh w-60 max-w-full flex-col justify-between overflow-y-auto border-r border-neutral-200 bg-neutral-100 font-auth"
      >
        <IconButton
          ref={closeButton}
          label="메뉴 닫기"
          onClick={onClose}
          className="absolute top-2 right-2 text-neutral-400"
        >
          <ClearIcon aria-hidden="true" />
        </IconButton>
        <div className="shrink-0 py-6">
          <div className="px-4">
            <ProfileAvatar
              alt={user ? `${user.nickname} 프로필` : 'Gitlog'}
              src={user?.avatarUrl}
              className="size-16"
            />
          </div>
          {user ? (
            <div className="flex flex-col gap-3 px-5 py-3">
              <h2 className="text-2xl leading-10 font-medium break-words text-black">
                {user.nickname}
              </h2>
              <p className="text-sm leading-6 font-light break-words text-zinc-800">
                {user.introduction}
              </p>
            </div>
          ) : (
            <p className="px-5 py-3 text-sm leading-6 font-light text-zinc-800">
              You can make anything by writing
            </p>
          )}
          <nav aria-label="깃로그 메뉴" className="mt-5 flex gap-2.5 px-4">
            {user ? (
              <>
                <GitlogButton onClick={onMyGitlog} className="flex-1 text-sm leading-6">
                  나의 깃로그
                </GitlogButton>
                <GitlogButton onClick={onWrite} className="flex-1 text-sm leading-6">
                  깃로그 쓰기
                </GitlogButton>
              </>
            ) : (
              <GitlogButton onClick={onStart} className="text-sm leading-6">
                깃로그 시작하기
              </GitlogButton>
            )}
          </nav>
        </div>
        {user && (
          <div className="flex shrink-0 gap-2.5 px-4 pt-11 pb-6">
            <GitlogButton
              onClick={onSettings}
              className="flex-1 border-neutral-400 text-sm leading-6 text-neutral-400 hover:bg-neutral-50 hover:text-neutral-500"
            >
              설정
            </GitlogButton>
            <GitlogButton
              ref={logoutButton}
              onClick={() => setLogoutOpen(true)}
              className="flex-1 border-neutral-400 text-sm leading-6 text-neutral-400 hover:bg-neutral-50 hover:text-neutral-500"
            >
              로그아웃
            </GitlogButton>
          </div>
        )}
      </aside>
      <ConfirmDialog
        open={logoutOpen}
        onOpenChange={setLogoutOpen}
        title="로그아웃을 진행할게요"
        confirmLabel="로그아웃"
        confirmClassName="bg-gitlog-action text-white hover:bg-gitlog-action/90"
        onConfirm={() => {
          setLogoutOpen(false);
          onLogout();
        }}
        onCloseAutoFocus={(event) => {
          event.preventDefault();
          (logoutButton.current ?? closeButton.current)?.focus({ preventScroll: true });
        }}
      />
    </>
  );
}
