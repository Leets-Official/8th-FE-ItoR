import type { ButtonHTMLAttributes } from 'react';
import { Icon } from './Icon';
import { cn } from '@/shared/lib/utils';

// 같은 속성의 색 클래스가 겹치면 CSS 생성 순서로 승자가 정해지므로, 색은 상태별 클래스에서만 지정한다
const BASE_BUTTON_CLASS =
  'inline-flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-[2px] border font-roboto text-[14px] leading-[22px] disabled:cursor-default';
const DEFAULT_COLOR_CLASS =
  'border-gray-85 bg-white text-black/85 hover:border-point hover:text-point';
const SELECTED_COLOR_CLASS = 'border-point bg-white text-point';

interface PaginationItemProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  page: number;
  selected?: boolean;
}

export function PaginationItem({
  page,
  selected = false,
  disabled = false,
  type = 'button',
  className,
  ...props
}: PaginationItemProps) {
  return (
    <button
      type={type}
      aria-label={`${page}페이지`}
      aria-current={selected ? 'page' : undefined}
      disabled={disabled}
      className={cn(
        BASE_BUTTON_CLASS,
        disabled
          ? 'border-gray-85 bg-gray-96 font-normal text-black/25'
          : selected
            ? [SELECTED_COLOR_CLASS, 'font-medium']
            : [DEFAULT_COLOR_CLASS, 'font-normal'],
        className,
      )}
      {...props}
    >
      {page}
    </button>
  );
}

export type PaginationDirection = 'previous' | 'next';

interface PaginationArrowButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  direction: PaginationDirection;
  pressed?: boolean;
}

export function PaginationArrowButton({
  direction,
  pressed = false,
  disabled = false,
  type = 'button',
  className,
  ...props
}: PaginationArrowButtonProps) {
  const isPrevious = direction === 'previous';

  return (
    <button
      type={type}
      aria-label={isPrevious ? '이전 페이지' : '다음 페이지'}
      disabled={disabled}
      className={cn(
        BASE_BUTTON_CLASS,
        disabled
          ? 'border-gray-85 bg-white text-gray-85'
          : pressed
            ? SELECTED_COLOR_CLASS
            : DEFAULT_COLOR_CLASS,
        className,
      )}
      {...props}
    >
      <Icon name={isPrevious ? 'pagination_left' : 'pagination_right'} size={12} />
    </button>
  );
}

const PAGES_PER_BLOCK = 5;

interface PaginationProps {
  pageCount: number;
  currentPage?: number;
  onPageChange?: (page: number) => void;
  className?: string;
}

export function Pagination({ pageCount, currentPage, onPageChange, className }: PaginationProps) {
  // 페이지가 많아져도 버튼이 무한히 늘어나지 않도록 현재 페이지가 속한 5개 블록만 보여준다
  const blockStart =
    currentPage === undefined
      ? 1
      : Math.floor((currentPage - 1) / PAGES_PER_BLOCK) * PAGES_PER_BLOCK + 1;
  const blockEnd = Math.min(blockStart + PAGES_PER_BLOCK - 1, pageCount);
  const pages = Array.from({ length: blockEnd - blockStart + 1 }, (_, index) => blockStart + index);

  const previousDisabled = currentPage === undefined || blockStart <= 1;
  const nextDisabled = currentPage !== undefined && blockEnd >= pageCount;

  return (
    <nav aria-label="페이지 탐색" className={cn('inline-flex items-center gap-2', className)}>
      <PaginationArrowButton
        direction="previous"
        disabled={previousDisabled}
        onClick={() => currentPage !== undefined && onPageChange?.(blockStart - 1)}
      />
      {pages.map((page) => (
        <PaginationItem
          key={page}
          page={page}
          selected={page === currentPage}
          onClick={() => onPageChange?.(page)}
        />
      ))}
      <PaginationArrowButton
        direction="next"
        disabled={nextDisabled}
        onClick={() => currentPage !== undefined && onPageChange?.(blockEnd + 1)}
      />
    </nav>
  );
}
