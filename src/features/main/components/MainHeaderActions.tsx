import { useNavigate } from '@tanstack/react-router';

import { useAuth } from '@/shared/auth/hooks/useAuth';
import { CreateIcon } from '@/shared/assets/icons/icons';
import { Icon } from '@/shared/assets/icons/Icon';

type MainHeaderActionsProps = {
  onLoginRequired: () => void;
};

export function MainHeaderActions({ onLoginRequired }: MainHeaderActionsProps) {
  const navigate = useNavigate();
  const { auth } = useAuth();

  async function handleWriteClick() {
    if (auth) {
      await navigate({ to: '/write' });
      return;
    }

    onLoginRequired();
  }

  return (
    <button
      type="button"
      onClick={handleWriteClick}
      className="flex items-center gap-1 rounded-[25px] px-3 py-2 text-gray-56"
    >
      <Icon source={CreateIcon} size="icon-24" />
      <span className="text-14-regular">깃로그 쓰기</span>
    </button>
  );
}
