import { NavigateBeforeIcon } from '@/shared/assets/icons';
import { cn } from '@/shared/utils/cn';

const PAGE_GROUP_SIZE = 5;

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function Pagination({ currentPage, totalPages, onPageChange, className }: PaginationProps) {
  const page = Math.min(Math.max(1, currentPage), Math.max(1, totalPages));
  const startPage = Math.floor((page - 1) / PAGE_GROUP_SIZE) * PAGE_GROUP_SIZE + 1;
  const visiblePageCount = Math.min(PAGE_GROUP_SIZE, Math.max(0, totalPages - startPage + 1));
  const pages = Array.from({ length: visiblePageCount }, (_, index) => startPage + index);

  return (
    <nav aria-label="페이지 탐색" className={cn('flex items-center gap-2', className)}>
      <PaginationControl
        label="이전 페이지 그룹"
        disabled={startPage === 1}
        onClick={() => onPageChange(startPage - PAGE_GROUP_SIZE)}
      >
        <NavigateBeforeIcon aria-hidden="true" className="size-3" />
      </PaginationControl>
      {pages.map((pageNumber) => (
        <PaginationControl
          key={pageNumber}
          label={`${pageNumber} 페이지`}
          current={pageNumber === page}
          onClick={() => onPageChange(pageNumber)}
        >
          {pageNumber}
        </PaginationControl>
      ))}
      <PaginationControl
        label="다음 페이지 그룹"
        disabled={startPage + PAGE_GROUP_SIZE > totalPages}
        onClick={() => onPageChange(startPage + PAGE_GROUP_SIZE)}
      >
        <NavigateBeforeIcon aria-hidden="true" className="size-3 rotate-180" />
      </PaginationControl>
    </nav>
  );
}

interface PaginationControlProps {
  label: string;
  children: React.ReactNode;
  current?: boolean;
  disabled?: boolean;
  onClick: () => void;
}

function PaginationControl({
  label,
  children,
  current = false,
  disabled = false,
  onClick,
}: PaginationControlProps) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-current={current ? 'page' : undefined}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        'flex size-8 items-center justify-center rounded-xs border bg-white text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
        current
          ? 'border-gitlog-action bg-blue-50 text-gitlog-action'
          : 'border-zinc-300 text-black/90',
        disabled && 'cursor-not-allowed text-neutral-300',
      )}
    >
      {children}
    </button>
  );
}
