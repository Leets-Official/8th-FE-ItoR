import { Icon, type IconSource } from '@/shared/assets/icons/Icon';

type ActiveButtonProps = {
  icon: IconSource;
  text: string;
};

/**
 * icon: 왼쪽에 표시할 아이콘
 * text: 오른쪽에 표시할 텍스트
 * @returns 누르는 동안 배경색이 바뀌는 아이콘·텍스트 버튼
 */
export const ActiveButton = ({ icon, text }: ActiveButtonProps) => {
  return (
    <button
      type="button"
      className="text-12-regular inline-flex h-fit w-fit items-center gap-1 rounded-sm bg-transparent px-2 py-1 pt-0.5 text-gray-56 active:bg-gray-90"
    >
      <span aria-hidden="true">
        <Icon source={icon} size="icon-14" />
      </span>
      <span>{text}</span>
    </button>
  );
};
