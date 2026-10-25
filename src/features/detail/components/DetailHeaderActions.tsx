import { useState } from 'react';

import { ChatIcon, MoreVertIcon } from '@/shared/assets/icons/icons';
import { IconButton } from '@/shared/ui/button/IconButton';
import { ActionDialog } from '@/shared/ui/dialog/ActionDialog';
import { DropDownMenu, type DropDownMenuItem } from '@/shared/ui/menu/DropDownMenu';

import { useDeleteBlogPost } from '../hooks/useDeleteBlogPost';

export function DetailHeaderActions() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { deleteBlogPost } = useDeleteBlogPost();
  const menuItems: readonly DropDownMenuItem[] = [
    { text: '수정하기' },
    { text: '삭제하기', variant: 'negative', onClick: openDeleteDialog },
  ];

  function toggleMenu() {
    setIsMenuOpen((currentState) => !currentState);
  }

  function openDeleteDialog() {
    setIsMenuOpen(false);
    setIsDeleteDialogOpen(true);
  }

  function closeDeleteDialog() {
    setIsDeleteDialogOpen(false);
  }

  async function confirmDelete() {
    await deleteBlogPost();
    closeDeleteDialog();
  }

  return (
    <div className="flex items-center gap-2">
      <IconButton icon={ChatIcon} label="댓글로 이동" />

      <div className="relative">
        <IconButton
          icon={MoreVertIcon}
          label={isMenuOpen ? '더보기 메뉴 닫기' : '더보기 메뉴 열기'}
          onClick={toggleMenu}
        />

        {isMenuOpen ? (
          <div className="absolute right-1.5 top-full z-10">
            <DropDownMenu items={menuItems} />
          </div>
        ) : null}
      </div>

      {isDeleteDialogOpen ? (
        <ActionDialog
          title="해당 블로그를 삭제하시겠어요?"
          description="삭제한 블로그는 다시 확인할 수 없어요."
          cancelLabel="취소"
          confirmLabel="삭제하기"
          onCancel={closeDeleteDialog}
          onConfirm={confirmDelete}
        />
      ) : null}
    </div>
  );
}
