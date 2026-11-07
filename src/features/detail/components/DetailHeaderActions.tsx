import { useId, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';

import { ChatIcon, MoreVertIcon } from '@/shared/assets/icons/icons';
import { IconButton } from '@/shared/ui/button/IconButton';
import { ActionDialog } from '@/shared/ui/dialog/ActionDialog';
import { DropDownMenu, type DropDownMenuItem } from '@/shared/ui/menu/DropDownMenu';

import { useDeleteBlogPost } from '../hooks/useDeleteBlogPost';
import { useDetailHeader } from '../hooks/useDetailHeader';
import { COMMENT_SECTION_ID } from '../model/comment';

export function DetailHeaderActions() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuId = useId();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { postId, isOwner } = useDetailHeader();
  const { deleteBlogPost } = useDeleteBlogPost(postId);
  const menuItems: readonly DropDownMenuItem[] = [
    { text: '수정하기', onClick: openEditPage },
    { text: '삭제하기', variant: 'negative', onClick: openDeleteDialog },
  ];

  function toggleMenu() {
    setIsMenuOpen((currentState) => !currentState);
  }

  function scrollToComments() {
    document
      .getElementById(COMMENT_SECTION_ID)
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function openDeleteDialog() {
    setIsMenuOpen(false);
    setIsDeleteDialogOpen(true);
  }

  function openEditPage() {
    setIsMenuOpen(false);

    if (postId) {
      void navigate({ to: '/posts/$postId/edit', params: { postId } });
    }
  }

  function closeDeleteDialog() {
    setIsDeleteDialogOpen(false);
  }

  async function confirmDelete() {
    if (!postId) {
      return;
    }

    await deleteBlogPost();
    closeDeleteDialog();
  }

  return (
    <div className="flex items-center gap-2">
      <IconButton icon={ChatIcon} label="댓글로 이동" onClick={scrollToComments} />

      {isOwner ? (
        <div className="relative">
          <IconButton
            icon={MoreVertIcon}
            label={isMenuOpen ? '더보기 메뉴 닫기' : '더보기 메뉴 열기'}
            ariaControls={menuId}
            ariaExpanded={isMenuOpen}
            ariaHasPopup="menu"
            onClick={toggleMenu}
          />

          {isMenuOpen ? (
            <div className="absolute right-1.5 top-full z-10">
              <DropDownMenu items={menuItems} id={menuId} onClose={toggleMenu} />
            </div>
          ) : null}
        </div>
      ) : null}

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
