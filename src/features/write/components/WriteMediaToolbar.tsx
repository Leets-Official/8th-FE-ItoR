import { AddPhotoAlternateIcon, FolderOpenIcon } from '@/shared/assets/icons/icons';

import { ActionButton } from '@/shared/ui/button/ActionButton';

export type WriteMediaAction = 'photo' | 'file';

type WriteMediaToolbarProps = {
  actions?: readonly WriteMediaAction[];
  onAction?: (action: WriteMediaAction) => void;
};

const DEFAULT_ACTIONS: readonly WriteMediaAction[] = ['photo', 'file'];

const actionConfig = {
  photo: {
    icon: AddPhotoAlternateIcon,
    text: '사진 추가하기',
  },
  file: {
    icon: FolderOpenIcon,
    text: '파일 추가하기',
  },
};

/** @returns 선택한 추가 작업 버튼을 표시하고 클릭한 작업을 전달하는 헤더 */
export function WriteMediaToolbar({ actions = DEFAULT_ACTIONS, onAction }: WriteMediaToolbarProps) {
  return (
    <header className="flex h-fit w-full items-center justify-center gap-8 bg-surface-overlay py-3 pl-3 pr-4 shadow-[0_4px_4px_rgba(0,0,0,0.01)] backdrop-blur-[4px]">
      {actions.map((action) => {
        const { icon, text } = actionConfig[action];

        return (
          <ActionButton key={action} icon={icon} text={text} onClick={() => onAction?.(action)} />
        );
      })}
    </header>
  );
}
