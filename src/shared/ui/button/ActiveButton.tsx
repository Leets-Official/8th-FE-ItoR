import { Icon, type IconSource } from '@/shared/assets/icons/Icon';

type ActiveButtonProps = {
  icon?: IconSource;
  text: string;
  width?: number;
  height?: number;
  onClick?: () => void;
};

/**
 * icon: 왼쪽에 선택적으로 표시할 아이콘
 * text: 오른쪽에 표시할 텍스트
 * width: 선택적으로 지정하는 버튼 너비(px)
 * height: 선택적으로 지정하는 버튼 높이(px)
 * onClick: 버튼 클릭 시 실행할 함수
 * @returns 누르는 동안 배경색이 바뀌는 아이콘·텍스트 버튼
 */
export function ActiveButton({ icon, text, width, height, onClick }: ActiveButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{ width, height }}
      className="text-12-regular inline-flex h-fit w-fit items-center justify-center gap-1 rounded-sm bg-transparent px-2 py-1 pt-0.5 text-gray-56 active:bg-gray-90"
    >
      {icon && (
        <span aria-hidden="true">
          <Icon source={icon} size="icon-14" />
        </span>
      )}
      <span>{text}</span>
    </button>
  );
}
