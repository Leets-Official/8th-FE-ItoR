import { NavigateBeforeIcon } from '@/shared/assets/icons';
import { cn } from '@/shared/utils/cn';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function Pagination({ currentPage, totalPages, onPageChange, className }: PaginationProps) {
  const page = Math.min(Math.max(1, currentPage), Math.max(1, totalPages));
  const pages = Array.from({ length: Math.max(0, totalPages) }, (_, index) => index + 1);

  return (
    <nav aria-label="페이지 탐색" className={cn('flex flex-wrap items-center gap-2', className)}>
      <PaginationControl
        label="이전 페이지"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
      >
        <NavigateBeforeIcon aria-hidden="true" />
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
        label="다음 페이지"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        <NavigateBeforeIcon aria-hidden="true" className="rotate-180" />
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
        'flex size-13 items-center justify-center border-2 bg-white text-base transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
        current ? 'border-gitlog-action text-gitlog-action' : 'border-neutral-200 text-neutral-900',
        disabled && 'cursor-not-allowed text-neutral-300',
      )}
    >
      {children}
    </button>
  );
}
