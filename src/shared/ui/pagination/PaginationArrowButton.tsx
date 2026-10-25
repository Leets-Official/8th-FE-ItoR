import { ArrowLeftIcon, ArrowRightIcon } from '@/shared/assets/icons/icons';

export type PaginationArrowButtonProps = {
  /** 이동할 페이지 그룹 방향입니다. */
  direction: 'previous' | 'next';
  /** 이동할 그룹이 없을 때 버튼을 비활성화합니다. */
  disabled?: boolean;
  /** 버튼을 눌렀을 때 실행할 동작입니다. */
  onClick?: () => void;
};

/** Pagination에서 이전 또는 다음 페이지 그룹으로 이동할 때 사용하는 화살표 버튼입니다. */
export function PaginationArrowButton({
  direction,
  disabled = false,
  onClick,
}: PaginationArrowButtonProps) {
  const ArrowIcon = direction === 'previous' ? ArrowLeftIcon : ArrowRightIcon;

  return (
    <button
      type="button"
      aria-label={direction === 'previous' ? '이전 페이지 그룹' : '다음 페이지 그룹'}
      className="group flex h-fit w-fit shrink-0 items-center justify-center rounded-[2px] border border-neutral-5 bg-neutral-1 p-2.5 transition-colors duration-100 ease-out enabled:hover:border-primary-6"
      disabled={disabled}
      onClick={onClick}
    >
      <ArrowIcon className="text-black opacity-[0.85] transition-[color,opacity] duration-100 ease-out group-hover:text-primary-6 group-hover:opacity-100 group-disabled:text-neutral-5 group-disabled:opacity-100" />
    </button>
  );
}
