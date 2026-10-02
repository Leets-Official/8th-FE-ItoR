import { Icon, type IconSource } from '@/shared/assets/icons/Icon';

type ActiveRoundButtonProps = {
  variant: 'border' | 'normal' | 'black';
  icon?: IconSource;
  text: string;
  width?: number;
  height?: number;
  onClick?: () => void;
};

const variantStyles = {
  border: 'border border-gray-56 bg-white text-gray-56 active:bg-gray-90',
  normal: 'bg-white text-black active:bg-gray-90',
  black: 'bg-gray-7 text-white active:text-gray-56',
};

/**
 * 누르는 동안 선택한 유형에 따라 색상이 즉시 바뀌는 둥근 버튼입니다.
 * @param props - 버튼 속성.
 * @param props.variant - border·normal은 배경색, black은 아이콘·텍스트 색상이 바뀝니다.
 * @param props.icon - 왼쪽에 선택적으로 표시할 아이콘.
 * @param props.text - 오른쪽에 표시할 버튼 텍스트.
 * @param props.width - 선택적으로 지정하는 버튼 너비(px).
 * @param props.height - 선택적으로 지정하는 버튼 높이(px).
 * @param props.onClick - 클릭 시 실행할 콜백.
 * @returns 선택한 유형의 눌림 효과가 적용된 둥근 버튼.
 */
export function ActiveRoundButton({
  variant,
  icon,
  text,
  width,
  height,
  onClick,
}: ActiveRoundButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{ width, height }}
      className={`text-14-regular inline-flex h-10 w-fit items-center justify-center gap-1 whitespace-nowrap rounded-[25px] px-3 py-2 ${variantStyles[variant]}`}
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
