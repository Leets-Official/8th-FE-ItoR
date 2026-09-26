import { ActiveButton } from '../button/ActiveButton';
import { AddPhotoAlternateIcon, FolderOpenIcon } from '@/shared/assets/icons/icons';

/** @returns 사진과 파일 추가 버튼을 표시하는 헤더 */
export function AddHeader() {
  return (
    <header className="flex h-fit w-full items-center justify-center gap-8 bg-[rgba(255,255,255,0.9)] py-3 pl-3 pr-4 shadow-[0_4px_4px_rgba(0,0,0,0.01)] backdrop-blur-[4px]">
      <ActiveButton icon={AddPhotoAlternateIcon} text="사진 추가하기" />
      <ActiveButton icon={FolderOpenIcon} text="파일 추가하기" />
    </header>
  );
}
