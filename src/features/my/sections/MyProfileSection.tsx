/** 마이페이지의 프로필 정보와 프로필 설정 진입 영역입니다. */

import { useNavigate } from '@tanstack/react-router';

import { useAuth } from '@/shared/auth/hooks/useAuth';
import { SettingsIcon } from '@/shared/assets/icons/icons';
import { Spacer } from '@/shared/ui/spacing/Spacer';
import { ActionButton } from '@/shared/ui/button/ActionButton';
import { Avatar } from '@/shared/ui/avatar/Avatar';
import { TextContent } from '@/shared/ui/text/TextContent';

export function MyProfileSection() {
  const navigate = useNavigate();
  const { auth } = useAuth();

  function openProfileEditPage() {
    void navigate({ to: '/my/edit' });
  }

  return (
    <section className="flex h-fit w-full flex-col items-center justify-center border-b border-gray-96 bg-gray-96">
      <Spacer variant="64" />

      <div className="flex h-fit w-full max-w-[688px] gap-2.5 px-4 py-3">
        <Avatar size="medium" src={auth?.profilePicture ?? undefined} />
      </div>

      <TextContent
        variant="24"
        title={auth?.nickname ?? ''}
        subtitle={auth?.introduction ?? ''}
        headingLevel={1}
      />

      <div className="flex h-fit w-full max-w-[688px] gap-2.5 px-4 py-3">
        <ActionButton
          icon={SettingsIcon}
          text="내 프로필 설정"
          hasBorder={true}
          onClick={openProfileEditPage}
        />
      </div>

      <Spacer variant="20" />
    </section>
  );
}
/** 마이페이지의 프로필 정보와 프로필 설정 진입 영역입니다. */
