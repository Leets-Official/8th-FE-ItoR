import { PaginationArrowButton } from './PaginationArrowButton';
import { PaginationNumberButton } from './PaginationNumberButton';

const PAGE_GROUP_SIZE = 5;

type CustomPaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

/**
 * currentPage: 현재 페이지
 * totalPages: 전체 페이지 수
 * onPageChange: 페이지 변경 시 실행할 함수
 * @returns 이전·다음 및 숫자 버튼으로 구성된 페이지네이션
 */
export function CustomPagination({ currentPage, totalPages, onPageChange }: CustomPaginationProps) {
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
