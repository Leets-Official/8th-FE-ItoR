import { Icon, type IconSource } from '@/shared/assets/icons/Icon';

type RoundButtonProps = {
  color: string;
  icon?: IconSource;
  text: string;
  width?: number;
  height?: number;
  onClick?: () => void;
};

/**
 * 기본 둥근 버튼입니다.
 * @param props - 버튼 속성.
 * @param props.color - 버튼 테두리·아이콘·텍스트에 적용할 색상.
 * @param props.icon - 왼쪽에 선택적으로 표시할 아이콘.
 * @param props.text - 오른쪽에 표시할 버튼 텍스트.
 * @param props.width - 선택적으로 지정하는 버튼 너비(px).
 * @param props.height - 선택적으로 지정하는 버튼 높이(px).
 * @param props.onClick - 클릭 시 실행할 콜백.
 * @returns 클릭에 따른 색상 변화가 없는 버튼 요소.
 */
export function RoundButton({ color, icon, text, width, height, onClick }: RoundButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-14-regular inline-flex h-10 w-fit items-center justify-center gap-1 whitespace-nowrap rounded-[25px] border px-3 py-2"
      style={{ color, width, height }}
    >
      {icon && (
        <span aria-hidden="true">
          <Icon source={icon} size="icon-24" />
        </span>
      )}
      <span>{text}</span>
    </button>
  );
}
