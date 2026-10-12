import type { MouseEventHandler, ReactNode } from 'react';
import { Button } from './Button';
import { IconButton } from './IconButton';
import { cn } from '@/shared/lib/utils';

// basic: 메뉴·로고만 있는 헤더 (회원가입 등)
export type PageHeaderVariant = 'main' | 'detail' | 'write' | 'basic';

interface PageHeaderProps {
  variant?: PageHeaderVariant;
  createLabel?: ReactNode;
  onMenu?: MouseEventHandler<HTMLButtonElement>;
  onCreate?: MouseEventHandler<HTMLButtonElement>;
  onChat?: MouseEventHandler<HTMLButtonElement>;
  onMore?: MouseEventHandler<HTMLButtonElement>;
  onDelete?: MouseEventHandler<HTMLButtonElement>;
  onPublish?: MouseEventHandler<HTMLButtonElement>;
  className?: string;
}

export function PageHeader({
  variant = 'main',
  createLabel = '깃로그 쓰기',
  onMenu,
  onCreate,
  onChat,
  onMore,
  onDelete,
  onPublish,
  className,
}: PageHeaderProps) {
  return (
    <header
      className={cn(
        'flex h-[72px] w-full items-center justify-between bg-white/90 py-4 pr-4 pl-3 backdrop-blur-[2px]',
        (variant === 'write' || variant === 'basic') && 'border-b border-gray-96',
        className,
      )}
    >
      <div className="flex h-10 w-[125px] items-center gap-2">
        <IconButton icon="reorder" label="메뉴" onClick={onMenu} />
        <div className="flex h-10 w-[77px] items-center justify-center">
          <span className="font-smooch text-[20px] leading-7 text-black">GITLOG</span>
        </div>
      </div>

      {variant === 'main' && (
        <Button
          variant="white"
          icon="create"
          className="w-[120px] whitespace-nowrap"
          onClick={onCreate}
        >
          {createLabel}
        </Button>
      )}

      {variant === 'detail' && (
        <div className="flex h-10 w-[88px] items-center gap-2">
          <IconButton icon="chat" label="채팅" onClick={onChat} />
          <IconButton icon="more_vert" label="더보기" onClick={onMore} />
        </div>
      )}

      {variant === 'write' && (
        <div className="flex h-[38px] items-start justify-end gap-2.5">
          <button
            type="button"
            className="flex h-[38px] w-[76px] cursor-pointer items-center justify-center rounded-full px-3 py-2 text-14 text-negative hover:bg-gray-90 active:bg-gray-90"
            onClick={onDelete}
          >
            삭제하기
          </button>
          <button
            type="button"
            className="flex h-[38px] w-[76px] cursor-pointer items-center justify-center rounded-full px-3 py-2 text-14 text-black hover:bg-gray-90 active:bg-gray-90"
            onClick={onPublish}
          >
            게시하기
          </button>
        </div>
      )}
    </header>
  );
}

interface CompactPageHeaderProps {
  createLabel?: ReactNode;
  openLabel?: ReactNode;
  onCreate?: MouseEventHandler<HTMLButtonElement>;
  onOpen?: MouseEventHandler<HTMLButtonElement>;
  className?: string;
}

export function CompactPageHeader({
  createLabel = '깃로그 시작하기',
  openLabel = '깃로그 불러오기',
  onCreate,
  onOpen,
  className,
}: CompactPageHeaderProps) {
  return (
    <header
      className={cn(
        'flex h-[49px] w-full items-center justify-center bg-white/90 py-3 pr-4 pl-3 shadow-[0_4px_4px_rgba(0,0,0,0.01)] backdrop-blur-[2px]',
        className,
      )}
    >
      <nav aria-label="깃로그 메뉴" className="flex items-center gap-8">
        <Button
          variant="text"
          icon="add_photo_alternate"
          className="h-[25px] w-[103px] whitespace-nowrap"
          onClick={onCreate}
        >
          {createLabel}
        </Button>
        <Button
          variant="text"
          icon="folder_open"
          className="h-[25px] w-[103px] whitespace-nowrap"
          onClick={onOpen}
        >
          {openLabel}
        </Button>
      </nav>
    </header>
  );
}
