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

interface PaginationProps {
  pageCount: number;
  currentPage?: number;
  onPageChange?: (page: number) => void;
  className?: string;
}

export function Pagination({ pageCount, currentPage, onPageChange, className }: PaginationProps) {
  const pages = Array.from({ length: pageCount }, (_, index) => index + 1);
  const previousDisabled = currentPage === undefined || currentPage <= 1;
  const nextDisabled = currentPage !== undefined && currentPage >= pageCount;

  return (
    <nav aria-label="페이지 탐색" className={cn('inline-flex items-center gap-2', className)}>
      <PaginationArrowButton
        direction="previous"
        disabled={previousDisabled}
        onClick={() => currentPage !== undefined && onPageChange?.(currentPage - 1)}
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
        onClick={() => currentPage !== undefined && onPageChange?.(currentPage + 1)}
      />
    </nav>
  );
}
