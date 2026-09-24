import { Icon, type IconSource } from '@/shared/assets/icons/Icon';

type IconButtonProps = {
  icon: IconSource;
  onClick?: () => void;
};

// TODO: 이동 대상 구현 시 Move in Left(300ms, ease-out) 애니메이션을 추가합니다.
/**
 * icon: 버튼에 표시할 아이콘
 * onClick: 버튼 클릭 시 실행할 함수
 * @returns 40px 영역에 아이콘을 표시하는 버튼
 */
export const IconButton = ({ icon, onClick }: IconButtonProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex h-10 w-10 shrink-0 items-center justify-center transition-colors duration-300 ease-out active:rounded-[4px] active:bg-gray-90"
    >
      <Icon source={icon} size="icon-24" />
    </button>
  );
};
