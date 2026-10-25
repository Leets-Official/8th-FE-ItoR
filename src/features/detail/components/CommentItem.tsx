import { useId, useState } from 'react';

import { PillButton } from '@/shared/ui/button/PillButton';
import { ActionDialog } from '@/shared/ui/dialog/ActionDialog';
import { DropDownMenu, type DropDownMenuItem } from '@/shared/ui/menu/DropDownMenu';
import { Spacer } from '@/shared/ui/spacing/Spacer';
import { formatRelativeDate } from '@/shared/utils/date';

import type { CommentGetDto } from '../api/detailApi';
import { CommentAuthor } from './CommentAuthor';

export type CommentItemProps = {
  commentGetDto: CommentGetDto;
  currentTime: Date;
  isCommentPending: boolean;
  onUpdateComment: (commentId: number, content: string) => Promise<boolean>;
  onDeleteComment: (commentId: number) => Promise<void>;
};

/** 댓글 내용과 작성자 본인의 수정·삭제 동작을 표시합니다. */
export function CommentItem({
  commentGetDto,
  currentTime,
  isCommentPending,
  onUpdateComment,
  onDeleteComment,
}: CommentItemProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuId = useId();
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(commentGetDto.content ?? '');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const commentId = commentGetDto.commentId;
  const canManageComment = commentGetDto.isOwner === true && commentId !== undefined;
  const menuItems: readonly DropDownMenuItem[] = [
    { text: '수정하기', onClick: startEditing },
    { text: '삭제하기', variant: 'negative', onClick: openDeleteDialog },
  ];

  function toggleMenu() {
    setIsMenuOpen((currentState) => !currentState);
  }

  function openDeleteDialog() {
    if (!canManageComment) {
      return;
    }

    setIsMenuOpen(false);
    setIsDeleteDialogOpen(true);
  }

  function startEditing() {
    if (!canManageComment) {
      return;
    }

    setIsMenuOpen(false);
    setContent(commentGetDto.content ?? '');
    setIsEditing(true);
  }

  function cancelEditing() {
    setContent(commentGetDto.content ?? '');
    setIsEditing(false);
  }

  async function saveComment() {
    if (!commentGetDto.isOwner || commentId === undefined || !content.trim() || isCommentPending) {
      return;
    }

    const isUpdated = await onUpdateComment(commentId, content.trim());
    if (isUpdated) {
      setIsEditing(false);
    }
  }

  function closeDeleteDialog() {
    setIsDeleteDialogOpen(false);
  }

  async function confirmDelete() {
    if (!commentGetDto.isOwner || commentId === undefined) {
      return;
    }

    await onDeleteComment(commentId);
    closeDeleteDialog();
  }

  return (
    <article className="flex h-fit w-full max-w-[688px] flex-col bg-white">
      <div className="relative">
        <CommentAuthor
          nickName={commentGetDto.nickName ?? ''}
          profileUrl={commentGetDto.profileUrl || undefined}
          date={formatRelativeDate(commentGetDto.createdAt ?? '', currentTime)}
          showMenu={canManageComment}
          onMenuClick={toggleMenu}
          menuId={menuId}
          isMenuOpen={isMenuOpen}
        />

        {isMenuOpen ? (
          <div className="absolute right-1.5 top-full z-10">
            <DropDownMenu items={menuItems} id={menuId} onClose={toggleMenu} />
          </div>
        ) : null}
      </div>

      <div className="flex h-fit w-full flex-col pl-[26px]">
        <div className="flex h-fit w-full max-w-[688px] gap-2.5 bg-white px-4 py-3">
          {isEditing ? (
            <div className="flex w-full flex-col gap-2">
              <textarea
                aria-label="댓글 수정 내용"
                className="text-14-light min-h-20 w-full resize-none rounded-[4px] border border-gray-90 bg-transparent px-3 py-2 text-gray-20 outline-none focus:border-gray-33"
                value={content}
                onChange={(event) => setContent(event.currentTarget.value)}
              />
              <div className="flex justify-end gap-2">
                <PillButton
                  type="button"
                  variant="neutral"
                  text="취소"
                  width={64}
                  height={38}
                  onClick={cancelEditing}
                />
                <PillButton
                  type="button"
                  variant={content.trim() ? 'dark' : 'neutral'}
                  text="저장"
                  width={64}
                  height={38}
                  disabled={!content.trim() || isCommentPending}
                  onClick={() => void saveComment()}
                />
              </div>
            </div>
          ) : (
            <span className="text-14-light whitespace-pre-wrap break-words text-gray-20">
              {commentGetDto.content}
            </span>
          )}
        </div>
      </div>
      <Spacer variant="20" />

      {isDeleteDialogOpen ? (
        <ActionDialog
          title="해당 댓글을 삭제하시겠어요?"
          description="삭제한 댓글은 다시 확인할 수 없어요."
          cancelLabel="취소"
          confirmLabel="삭제하기"
          confirmDisabled={isCommentPending}
          onCancel={closeDeleteDialog}
          onConfirm={() => void confirmDelete()}
        />
      ) : null}
    </article>
  );
}
