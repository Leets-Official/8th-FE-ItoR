import type { MouseEventHandler, ReactNode } from 'react';
import { Link } from 'react-router';
import { Button } from './Button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './DropdownMenu';
import { IconButton } from './IconButton';
import { cn } from '@/shared/lib/utils';

// basic: 메뉴·로고만 있는 헤더 (회원가입 등), profile: 수정하기 버튼이 있는 헤더 (내 프로필 설정)
// profile-edit: 내 프로필 설정에서 수정하기를 누르면 바뀌는 취소하기·저장하기 헤더
export type PageHeaderVariant = 'main' | 'detail' | 'write' | 'basic' | 'profile' | 'profile-edit';

// write·profile·profile-edit 헤더 오른쪽의 글자 버튼. 글자색은 버튼마다 따로 붙인다
const TEXT_BUTTON_CLASS =
  'flex h-[38px] w-[76px] cursor-pointer items-center justify-center rounded-full px-3 py-2 text-14 hover:bg-gray-90 active:bg-gray-90';

interface PageHeaderProps {
  variant?: PageHeaderVariant;
  createLabel?: ReactNode;
  onMenu?: MouseEventHandler<HTMLButtonElement>;
  onCreate?: MouseEventHandler<HTMLButtonElement>;
  onChat?: MouseEventHandler<HTMLButtonElement>;
  // detail에서는 더보기 메뉴의 수정하기·삭제하기 항목이 되고, 둘 다 없으면 더보기 버튼을 숨긴다
  onEdit?: () => void;
  onDelete?: () => void;
  onPublish?: MouseEventHandler<HTMLButtonElement>;
  onCancel?: MouseEventHandler<HTMLButtonElement>;
  onSave?: MouseEventHandler<HTMLButtonElement>;
  className?: string;
}

export function PageHeader({
  variant = 'main',
  createLabel = '깃로그 쓰기',
  onMenu,
  onCreate,
  onChat,
  onDelete,
  onPublish,
  onEdit,
  onCancel,
  onSave,
  className,
}: PageHeaderProps) {
  return (
    <header
      className={cn(
        'flex h-[72px] w-full items-center justify-between bg-white/90 py-4 pr-4 pl-3 backdrop-blur-[2px]',
        (variant === 'write' || variant === 'basic' || variant === 'profile-edit') &&
          'border-b border-gray-96',
        className,
      )}
    >
      <div className="flex h-10 w-[125px] items-center gap-2">
        <IconButton icon="reorder" label="메뉴" onClick={onMenu} />
        <Link
          to="/"
          aria-label="메인으로 이동"
          className="flex h-10 w-[77px] items-center justify-center"
        >
          <span className="font-smooch text-[20px] leading-7 text-black">GITLOG</span>
        </Link>
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
        <div className="flex h-10 items-center gap-2">
          <IconButton icon="chat" label="채팅" onClick={onChat} />
          {(onEdit || onDelete) && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <IconButton icon="more_vert" label="더보기" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {onEdit && <DropdownMenuItem onSelect={onEdit}>수정하기</DropdownMenuItem>}
                {onDelete && (
                  <DropdownMenuItem variant="destructive" onSelect={onDelete}>
                    삭제하기
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      )}

      {variant === 'write' && (
        <div className="flex h-[38px] items-start justify-end gap-2.5">
          <button
            type="button"
            className={cn(TEXT_BUTTON_CLASS, 'text-negative')}
            onClick={() => onDelete?.()}
          >
            삭제하기
          </button>
          <button type="button" className={cn(TEXT_BUTTON_CLASS, 'text-black')} onClick={onPublish}>
            게시하기
          </button>
        </div>
      )}

      {variant === 'profile' && (
        <button
          type="button"
          className={cn(TEXT_BUTTON_CLASS, 'text-black')}
          onClick={() => onEdit?.()}
        >
          수정하기
        </button>
      )}

      {variant === 'profile-edit' && (
        <div className="flex h-[38px] items-start justify-end gap-2.5">
          <button
            type="button"
            className={cn(TEXT_BUTTON_CLASS, 'text-negative')}
            onClick={onCancel}
          >
            취소하기
          </button>
          <button type="button" className={cn(TEXT_BUTTON_CLASS, 'text-black')} onClick={onSave}>
            저장하기
          </button>
        </div>
      )}
    </header>
  );
}

interface CompactPageHeaderProps {
  // 가운데에 32px 간격으로 놓을 글자 버튼들 (예: 사진 추가하기, 깃로그 시작하기·불러오기)
  children: ReactNode;
  label?: string;
  className?: string;
}

export function CompactPageHeader({
  children,
  label = '깃로그 메뉴',
  className,
}: CompactPageHeaderProps) {
  return (
    <header
      className={cn(
        'flex h-[49px] w-full items-center justify-center bg-white/90 py-3 pr-4 pl-3 shadow-[0_4px_4px_rgba(0,0,0,0.01)] backdrop-blur-[2px]',
        className,
      )}
    >
      <nav aria-label={label} className="flex items-center gap-8">
        {children}
      </nav>
    </header>
  );
}
