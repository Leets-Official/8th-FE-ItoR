import { CreateIcon, ReorderIcon, ChatIcon, MoreVertIcon } from '@/shared/assets/icons/icons';
import { IconButton } from '../button/IconButton';
import { Logo } from '../logo/Logo';
import { Icon } from '@/shared/assets/icons/Icon';

export type PageHeaderVariant = 'ver1' | 'ver2' | 'ver3' | 'ver4';

type PageHeaderProps = {
  /** ver1: 깃로그 작성 / ver2: 채팅·더보기 / ver3: 삭제·게시 / ver4: 우측 버튼 없음 */
  variant: PageHeaderVariant;
  formId?: string;
};

const rightContent = {
  ver1: () => (
    <div className="flex items-center gap-1 rounded-[25px] px-3 py-2 text-gray-56">
      <Icon source={CreateIcon} size="icon-24" />
      <span className="text-14-regular">깃로그 쓰기</span>
    </div>
  ),
  ver2: () => (
    <div className="flex items-center gap-2">
      <IconButton icon={ChatIcon} />
      <IconButton icon={MoreVertIcon} />
    </div>
  ),
  ver3: (formId?: string) => (
    <div className="flex items-center gap-2.5">
      <button
        type="button"
        className="flex h-fit w-[76px] items-center gap-1 rounded-[25px] px-3 py-2"
      >
        <span className="text-14-regular text-negative">삭제하기</span>
      </button>
      <button
        type="submit"
        form={formId}
        className="flex h-fit w-[76px] items-center gap-1 rounded-[25px] px-3 py-2"
      >
        <span className="text-14-regular text-black">게시하기</span>
      </button>
    </div>
  ),
  ver4: () => null,
};

/** @returns 선택한 variant의 우측 영역을 표시하는 페이지 헤더 */
export function PageHeader({ variant, formId }: PageHeaderProps) {
  return (
    <header className="flex h-fit w-full items-center justify-between bg-[rgba(255,255,255,0.9)] py-4 pl-3 pr-4 backdrop-blur-sm">
      <div className="flex items-center gap-2">
        <IconButton icon={ReorderIcon} />
        <Logo />
      </div>

      {rightContent[variant](formId)}
    </header>
  );
}
