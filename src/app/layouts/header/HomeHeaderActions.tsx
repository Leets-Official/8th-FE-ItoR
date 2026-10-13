import { CreateIcon } from '@/shared/assets/icons';
import { GitlogButton } from '@/shared/ui/GitlogButton';

interface HomeHeaderActionsProps {
  onWrite: () => void;
}

export function HomeHeaderActions({ onWrite }: HomeHeaderActionsProps) {
  return (
    <GitlogButton
      appearance="text"
      onClick={onWrite}
      icon={<CreateIcon aria-hidden="true" className="opacity-50" />}
      className="h-10 rounded-full text-sm text-neutral-400"
    >
      깃로그 쓰기
    </GitlogButton>
  );
}
