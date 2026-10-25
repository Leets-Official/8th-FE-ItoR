import { Icon, type IconSource } from '@/shared/assets/icons/Icon';

export type IconButtonProps = {
  /** 버튼 안에 표시할 아이콘입니다. */
  icon: IconSource;
  /** 화면 낭독기에 전달할 버튼 동작 이름입니다. */
  label: string;
  /** 버튼을 눌렀을 때 실행할 동작입니다. */
  onClick?: () => void;
};

// TODO(UI): 내비게이션 전환 명세가 확정되면 300ms ease-out 이동 애니메이션을 적용합니다.
/** 40px 클릭 영역에 24px 아이콘을 표시하는 접근 가능한 아이콘 버튼입니다. */
export function IconButton({ icon, label, onClick }: IconButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="inline-flex h-10 w-10 shrink-0 items-center justify-center transition-colors duration-300 ease-out active:rounded-[4px] active:bg-gray-90"
    >
      <Icon source={icon} size="icon-24" />
    </button>
  );
}
