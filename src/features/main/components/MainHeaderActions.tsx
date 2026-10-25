import { useState } from 'react';

import { CreateIcon } from '@/shared/assets/icons/icons';
import { Icon } from '@/shared/assets/icons/Icon';

import { LoginDialog } from './LoginDialog';

type MainHeaderActionsProps = {
  enabled: boolean;
};

export function MainHeaderActions({ enabled }: MainHeaderActionsProps) {
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);

  function openLoginDialog() {
    setIsLoginDialogOpen(true);
  }

  function closeLoginDialog() {
    setIsLoginDialogOpen(false);
  }

  return (
    <>
      <button
        type="button"
        onClick={enabled ? openLoginDialog : undefined}
        className="flex items-center gap-1 rounded-[25px] px-3 py-2 text-gray-56"
      >
        <Icon source={CreateIcon} size="icon-24" />
        <span className="text-14-regular">깃로그 쓰기</span>
      </button>

      {isLoginDialogOpen ? <LoginDialog onClose={closeLoginDialog} /> : null}
    </>
  );
}
