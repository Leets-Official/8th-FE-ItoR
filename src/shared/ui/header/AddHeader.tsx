import { AddPhotoAlternateIcon, FolderOpenIcon } from '@/shared/assets/icons/icons';

import { ActiveButton } from '../button/ActiveButton';

export type AddHeaderAction = 'photo' | 'file';

type AddHeaderProps = {
  actions?: readonly AddHeaderAction[];
  onAction?: (action: AddHeaderAction) => void;
};

const DEFAULT_ACTIONS: readonly AddHeaderAction[] = ['photo', 'file'];

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
export function AddHeader({ actions = DEFAULT_ACTIONS, onAction }: AddHeaderProps) {
  return (
    <header className="flex h-fit w-full items-center justify-center gap-8 bg-[rgba(255,255,255,0.9)] py-3 pl-3 pr-4 shadow-[0_4px_4px_rgba(0,0,0,0.01)] backdrop-blur-[4px]">
      {actions.map((action) => {
        const { icon, text } = actionConfig[action];

        return (
          <ActiveButton key={action} icon={icon} text={text} onClick={() => onAction?.(action)} />
        );
      })}
    </header>
  );
}
