import { PaginationArrowButton } from './PaginationArrowButton';
import { PaginationNumberButton } from './PaginationNumberButton';

const PAGE_GROUP_SIZE = 5;

export type PaginationProps = {
  /** 1부터 시작하는 현재 페이지 번호입니다. */
  currentPage: number;
  /** 마지막 페이지 번호입니다. */
  totalPages: number;
  /** 숫자 또는 그룹 이동 버튼으로 선택한 페이지 번호를 전달받습니다. */
  onPageChange: (page: number) => void;
};

/** 페이지를 다섯 개씩 묶어 이전·다음 그룹과 숫자 버튼을 표시합니다. */
export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const firstPageInGroup = Math.floor((currentPage - 1) / PAGE_GROUP_SIZE) * PAGE_GROUP_SIZE + 1;
  const visiblePageNumbers = Array.from(
    { length: Math.min(PAGE_GROUP_SIZE, totalPages - firstPageInGroup + 1) },
    (_, index) => firstPageInGroup + index,
  );

  return (
    <div className="flex h-fit w-fit items-center justify-center gap-2">
      <PaginationArrowButton
        direction="previous"
        disabled={firstPageInGroup === 1}
        onClick={() => onPageChange(firstPageInGroup - PAGE_GROUP_SIZE)}
      />
      {visiblePageNumbers.map((pageNumber) => (
        <PaginationNumberButton
          key={pageNumber}
          pageNumber={pageNumber}
          isCurrent={pageNumber === currentPage}
          onClick={onPageChange}
        />
      ))}
      <PaginationArrowButton
        direction="next"
        disabled={firstPageInGroup + PAGE_GROUP_SIZE > totalPages}
        onClick={() => onPageChange(firstPageInGroup + PAGE_GROUP_SIZE)}
      />
    </div>
  );
}
