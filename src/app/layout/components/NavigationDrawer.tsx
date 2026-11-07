import { useState } from 'react';
import { createPortal } from 'react-dom';

import type { AppSession } from '@/app/layout/model/session';
import { Avatar } from '@/shared/ui/avatar/Avatar';
import { PillButton } from '@/shared/ui/button/PillButton';
import { ActionDialog } from '@/shared/ui/dialog/ActionDialog';
import { useModalFocus } from '@/shared/ui/dialog/hooks/useModalFocus';
import { Spacer } from '@/shared/ui/spacing/Spacer';
import { TextContent } from '@/shared/ui/text/TextContent';

type NavigationDrawerProps = {
  isOpen: boolean;
  session: AppSession;
  onLoginRequired: () => void;
  onMyPageOpen: () => void | Promise<void>;
  onWriteOpen: () => void | Promise<void>;
  onLogout?: () => void | Promise<void>;
  onClose: () => void;
};

type MemberNavigationContentProps = {
  session: AppSession;
  onMyPageOpen: () => void | Promise<void>;
  onWriteOpen: () => void | Promise<void>;
  onLogout?: () => void | Promise<void>;
  onDrawerClose: () => void;
};

type GuestNavigationContentProps = {
  onLoginRequired: () => void;
};

function GuestNavigationContent({ onLoginRequired }: GuestNavigationContentProps) {
  return (
    <div className="flex h-full w-[240px] flex-col gap-2.5 border-r border-gray-90 bg-gray-96">
      <div className="flex h-[278px] w-full flex-col py-6">
        <div className="flex h-fit w-full max-w-[688px] gap-2.5 px-4">
          <Avatar size="medium" />
        </div>

        <div className="flex h-fit w-full max-w-[688px] gap-2.5 px-5 py-3">
          <span className="text-14-light text-gray-20">You can make anything by writing</span>
        </div>

        <Spacer variant="20" />

        <div className="flex h-fit w-full flex-col gap-2.5 px-4">
          <PillButton variant="point" text="깃로그 시작하기" onClick={onLoginRequired} />
        </div>
      </div>
    </div>
  );
}

function MemberNavigationContent({
  session,
  onMyPageOpen,
  onWriteOpen,
  onLogout,
  onDrawerClose,
}: MemberNavigationContentProps) {
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);

  function openLogoutDialog() {
    setIsLogoutDialogOpen(true);
  }

  function closeLogoutDialog() {
    setIsLogoutDialogOpen(false);
  }

  async function confirmLogout() {
    await onLogout?.();
    closeLogoutDialog();
    onDrawerClose();
  }

  return (
    <>
      <div className="flex h-full w-[240px] flex-col justify-between border-r border-gray-90 bg-gray-96">
        <div className="flex h-fit w-full flex-col py-6">
          <div className="flex h-fit w-full flex-col">
            <div className="flex h-fit w-full max-w-[688px] gap-2.5 px-4">
              <Avatar size="medium" src={session.profilePicture} />
            </div>

            <TextContent variant="24" title={session.nickname} subtitle={session.introduction} />
          </div>

          <Spacer variant="20" />

          <div className="flex h-fit w-full gap-2.5 px-4">
            <PillButton variant="point" text="나의 깃로그" onClick={onMyPageOpen} />
            <PillButton variant="point" text="깃로그 쓰기" onClick={onWriteOpen} />
          </div>
        </div>

        <div className="flex h-fit w-full flex-col py-6">
          <Spacer variant="20" />

          <div className="flex h-fit w-full items-center justify-center gap-2.5 px-4">
            <PillButton variant="neutral" text="설정" width="fill" />
            <PillButton variant="neutral" text="로그아웃" width="fill" onClick={openLogoutDialog} />
          </div>
        </div>
      </div>

      {isLogoutDialogOpen ? (
        <ActionDialog
          title="로그아웃을 진행할게요"
          cancelLabel="취소"
          confirmLabel="로그아웃"
          confirmVariant="point"
          onCancel={closeLogoutDialog}
          onConfirm={confirmLogout}
        />
      ) : null}
    </>
  );
}

export function NavigationDrawer({
  isOpen,
  session,
  onLoginRequired,
  onMyPageOpen,
  onWriteOpen,
  onLogout,
  onClose,
}: NavigationDrawerProps) {
  const drawerRef = useModalFocus<HTMLDivElement>(onClose, isOpen);

  if (!isOpen) {
    return null;
  }

  return createPortal(
    <div className="fixed inset-0 z-[100]" onClick={onClose}>
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="전체 메뉴"
        tabIndex={-1}
        className="h-full w-fit"
        onClick={(event) => event.stopPropagation()}
      >
        {session.isLoggedIn ? (
          <MemberNavigationContent
            session={session}
            onMyPageOpen={onMyPageOpen}
            onWriteOpen={onWriteOpen}
            onLogout={onLogout}
            onDrawerClose={onClose}
          />
        ) : (
          <GuestNavigationContent onLoginRequired={onLoginRequired} />
        )}
      </div>
    </div>,
    document.body,
  );
}
