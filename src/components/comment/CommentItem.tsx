import { useState } from 'react';
import Avatar from '@/components/common/Avatar';
import ConfirmModal from '@/components/common/ConfirmModal';
import DropdownMenu from '@/components/common/DropdownMenu';
import type { Comment } from '@/types/comment';
import { formatDate } from '@/utils/formatDate';
import CommentEditor from './CommentEditor';

interface CommentItemProps {
  comment: Comment;
  /** 내가 쓴 댓글일 때만 수정/삭제 메뉴를 보여준다. */
  isMine: boolean;
  onEdit: (commentId: number, content: string) => void;
  onDelete: (commentId: number) => void;
}

function CommentItem({ comment, isMine, onEdit, onDelete }: CommentItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const { id, author, content, createdAt } = comment;

  if (isEditing) {
    return (
      <li>
        <CommentEditor
          author={author}
          initialContent={content}
          submitLabel="수정"
          onSubmit={(nextContent) => {
            onEdit(id, nextContent);
            setIsEditing(false);
          }}
          onCancel={() => setIsEditing(false)}
        />
      </li>
    );
  }

  return (
    <li className="border-b border-gray-50 py-4">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <Avatar src={author.profileImageUrl} alt="" size="sm" />
          <div className="flex flex-col">
            <span className="text-xs text-ink">{author.nickname}</span>
            <time dateTime={createdAt} className="text-[11px] text-gray-400">
              {formatDate(createdAt)}
            </time>
          </div>
        </div>
        {isMine && (
          <DropdownMenu
            label="댓글 메뉴"
            items={[
              { label: '수정하기', onSelect: () => setIsEditing(true) },
              { label: '삭제하기', onSelect: () => setIsDeleteModalOpen(true), isDanger: true },
            ]}
          />
        )}
      </div>
      <p className="mt-3 text-sm leading-relaxed font-light whitespace-pre-wrap text-gray-700">
        {content}
      </p>

      {isDeleteModalOpen && (
        <ConfirmModal
          title="댓글을 삭제하시겠습니까?"
          description="삭제된 댓글은 복구할 수 없습니다."
          confirmLabel="삭제하기"
          onCancel={() => setIsDeleteModalOpen(false)}
          onConfirm={() => {
            setIsDeleteModalOpen(false);
            onDelete(id);
          }}
        />
      )}
    </li>
  );
}

export default CommentItem;
