import { Icon, type IconSource } from '@/shared/assets/icons/Icon';

export type PillButtonProps = {
  /** 버튼의 색상과 상호작용 스타일입니다. */
  variant: 'point' | 'neutral' | 'plain' | 'dark';
  /** 폼 안에서 사용할 HTML 버튼 타입입니다. */
  type?: 'button' | 'submit' | 'reset';
  /** 텍스트 왼쪽에 표시할 선택 아이콘입니다. */
  icon?: IconSource;
  /** 버튼에 표시할 문구입니다. */
  text: string;
  /** 숫자는 px 너비, `fill`은 부모의 남은 너비를 채웁니다. */
  width?: number | 'fill';
  /** 버튼 높이(px)입니다. */
  height?: number;
  /** 버튼을 눌렀을 때 실행할 동작입니다. */
  onClick?: () => void;
};

const variantStyles = {
  point: 'border border-point bg-white text-point',
  neutral: 'border border-gray-56 bg-white text-gray-56 active:bg-gray-90',
  plain: 'bg-white text-black active:bg-gray-90',
  dark: 'bg-gray-7 text-white active:text-gray-56',
};

/** 둥근 모서리와 variant별 상태 스타일을 제공하는 주요 동작 버튼입니다. */
export function PillButton({
  variant,
  type = 'button',
  icon,
  text,
  width,
  height,
  onClick,
}: PillButtonProps) {
  const fillsAvailableWidth = width === 'fill';

  return (
    <button
      type={type}
      onClick={onClick}
      style={{ width: typeof width === 'number' ? width : undefined, height }}
      className={`text-14-regular inline-flex h-10 items-center justify-center gap-1 whitespace-nowrap rounded-[25px] px-3 py-2 ${fillsAvailableWidth ? 'flex-1' : 'w-fit'} ${variantStyles[variant]}`}
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
