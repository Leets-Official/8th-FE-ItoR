export type PaginationNumberButtonProps = {
  /** 버튼에 표시하고 클릭 시 전달할 페이지 번호입니다. */
  pageNumber: number;
  /** 현재 페이지 표시와 `aria-current`를 적용합니다. */
  isCurrent?: boolean;
  /** 페이지를 선택할 수 없게 합니다. */
  disabled?: boolean;
  /** 선택한 페이지 번호를 전달받습니다. */
  onClick?: (pageNumber: number) => void;
};

/** Pagination에서 개별 페이지를 선택할 때 사용하는 숫자 버튼입니다. */
export function PaginationNumberButton({
  pageNumber,
  isCurrent = false,
  disabled = false,
  onClick,
}: PaginationNumberButtonProps) {
  return (
    <button
      type="button"
      aria-label={`${pageNumber}페이지`}
      aria-current={isCurrent ? 'page' : undefined}
      className="group flex h-8 min-w-8 items-center justify-center rounded-[2px] border border-neutral-5 bg-neutral-1 px-[7px] py-px font-roboto text-sm font-normal leading-[22px] tracking-normal transition-colors duration-100 ease-out enabled:hover:border-primary-6"
      disabled={disabled}
      onClick={() => onClick?.(pageNumber)}
    >
      <span className="text-black opacity-[0.85] transition-[color,opacity] duration-100 ease-out group-hover:text-primary-6 group-hover:opacity-100 group-disabled:text-neutral-5 group-disabled:opacity-100">
        {pageNumber}
      </span>
    </button>
  );
}
