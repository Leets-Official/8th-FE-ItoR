type PaginationNumberButtonProps = {
  pageNumber: number;
  isCurrent?: boolean;
  disabled?: boolean;
  onClick?: (pageNumber: number) => void;
};

/**
 * pageNumber: 버튼에 표시할 페이지 번호
 * isCurrent: 현재 페이지 여부
 * disabled: 버튼 비활성화 여부
 * onClick: 숫자 버튼 클릭 시 실행할 함수
 * @returns 해당 페이지 번호를 표시하는 버튼
 */
export const PaginationNumberButton = ({
  pageNumber,
  isCurrent = false,
  disabled = false,
  onClick,
}: PaginationNumberButtonProps) => {
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
};
