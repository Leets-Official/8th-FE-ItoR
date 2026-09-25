import { ArrowLeftIcon, ArrowRightIcon } from '@/shared/assets/icons/icons';

type PaginationArrowButtonProps = {
  direction: 'previous' | 'next';
  disabled?: boolean;
  onClick?: () => void;
};

/**
 * direction: 이전·다음 이동 방향
 * disabled: 버튼 비활성화 여부
 * onClick: 버튼 클릭 시 실행할 함수
 * @returns 방향과 상태에 맞는 페이지 이동 버튼
 */
export const PaginationArrowButton = ({
  direction,
  disabled = false,
  onClick,
}: PaginationArrowButtonProps) => {
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
};
