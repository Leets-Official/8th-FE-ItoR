import { SettingsIcon } from '@/shared/assets/icons';
import type { User } from '@/shared/types/user';
import { Button } from '@/shared/ui/primitives/button';
import { ProfileAvatar } from '@/shared/ui/ProfileAvatar';

interface MyGitlogProfileProps {
  user: User;
  onSettings: () => void;
}

export function MyGitlogProfile({ user, onSettings }: MyGitlogProfileProps) {
  return (
    <section aria-label="내 프로필" className="border-b border-neutral-100 bg-neutral-100">
      <div className="mx-auto w-full max-w-[688px] pt-16 pb-5">
        <div className="px-4 py-3">
          <ProfileAvatar alt={`${user.nickname} 프로필`} src={user.avatarUrl} className="size-16" />
        </div>
        <div className="flex flex-col gap-3 px-4 py-3">
          <h2 className="text-2xl leading-10 font-medium break-words text-black">
            {user.nickname}
          </h2>
          <p className="text-sm leading-6 font-light break-words text-zinc-800">
            {user.introduction}
          </p>
        </div>
        <div className="px-4 py-3">
          <Button
            variant="outline"
            onClick={onSettings}
            className="h-auto gap-1 rounded-xs border-neutral-200 bg-transparent px-2 pt-0.5 pb-1 text-xs leading-5 font-normal text-neutral-400 hover:bg-neutral-200 hover:text-neutral-500"
          >
            <SettingsIcon aria-hidden="true" className="size-3.5" />내 프로필 설정
          </Button>
        </div>
      </div>
    </section>
  );
}
