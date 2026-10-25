import { Icon, type IconSource } from '@/shared/assets/icons/Icon';

export type ActionButtonProps = {
  /** 텍스트 왼쪽에 표시할 선택 아이콘입니다. */
  icon?: IconSource;
  /** 버튼에 표시할 문구입니다. */
  text: string;
  /** `true`이면 gray-90 테두리를 표시합니다. */
  hasBorder?: boolean;
  /** 버튼 너비(px)입니다. 생략하면 콘텐츠 너비를 사용합니다. */
  width?: number;
  /** 버튼 높이(px)입니다. 생략하면 콘텐츠 높이를 사용합니다. */
  height?: number;
  /** 버튼을 눌렀을 때 실행할 동작입니다. */
  onClick?: () => void;
};

/** 아이콘을 선택적으로 포함할 수 있는 작은 텍스트 동작 버튼입니다. */
export function ActionButton({
  icon,
  text,
  hasBorder = false,
  width,
  height,
  onClick,
}: ActionButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{ width, height }}
      className={`text-12-regular inline-flex h-fit w-fit items-center justify-center gap-1 rounded-sm bg-transparent px-2 py-1 pt-0.5 text-gray-56 active:bg-gray-90 ${hasBorder ? 'border border-gray-90' : ''}`}
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
