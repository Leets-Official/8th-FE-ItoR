import { ChevronLeft, ChevronRight } from 'lucide-react';
import { PAGE_GROUP_SIZE } from '@/constants/pagination';
import { cn } from '@/utils/cn';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const getVisiblePages = (currentPage: number, totalPages: number) => {
  const groupStart = Math.floor((currentPage - 1) / PAGE_GROUP_SIZE) * PAGE_GROUP_SIZE + 1;
  const groupEnd = Math.min(groupStart + PAGE_GROUP_SIZE - 1, totalPages);
  return Array.from({ length: groupEnd - groupStart + 1 }, (_, index) => groupStart + index);
};

const PAGE_BUTTON_CLASS =
  'inline-flex size-8 items-center justify-center rounded-xs border bg-white text-sm transition-colors focus-visible:outline-2 focus-visible:outline-point disabled:cursor-not-allowed disabled:text-gray-300';

function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <nav aria-label="페이지 이동" className="flex items-center justify-center gap-2 py-8">
      <button
        type="button"
        aria-label="이전 페이지"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className={cn(PAGE_BUTTON_CLASS, 'border-gray-100 hover:border-page-active')}
      >
        <ChevronLeft size={16} aria-hidden />
      </button>

      {getVisiblePages(currentPage, totalPages).map((page) => {
        const isCurrent = page === currentPage;
        return (
          <button
            key={page}
            type="button"
            aria-current={isCurrent ? 'page' : undefined}
            aria-label={`${page}페이지`}
            onClick={() => onPageChange(page)}
            className={cn(
              PAGE_BUTTON_CLASS,
              isCurrent
                ? 'border-page-active text-page-active'
                : 'border-gray-100 text-ink hover:border-page-active',
            )}
          >
            {page}
          </button>
        );
      })}

      <button
        type="button"
        aria-label="다음 페이지"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className={cn(PAGE_BUTTON_CLASS, 'border-gray-100 hover:border-page-active')}
      >
        <ChevronRight size={16} aria-hidden />
      </button>
    </nav>
  );
}

export default Pagination;
