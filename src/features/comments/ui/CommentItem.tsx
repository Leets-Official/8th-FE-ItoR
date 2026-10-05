import { useRef, useState } from 'react';

import { formatPublishedTime } from '@/shared/utils/formatPublishedTime';
import { MoreVertIcon } from '@/shared/assets/icons';
import { ActionMenu } from '@/shared/ui/ActionMenu';
import { IconButton } from '@/shared/ui/IconButton';
import { ProfileAvatar } from '@/shared/ui/ProfileAvatar';

import type { CommentAuthor, PostComment } from '../model/comment';
import { CommentForm } from './CommentForm';

interface CommentItemProps {
  comment: PostComment;
  currentUser: CommentAuthor | null;
  now: number;
  onEdit: (id: string, content: string) => void;
  onDelete: (id: string) => void;
}

export function CommentItem({ comment, currentUser, now, onEdit, onDelete }: CommentItemProps) {
  const [editing, setEditing] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const selectedAction = useRef<'edit' | 'delete' | null>(null);
  const editor = useRef<HTMLTextAreaElement>(null);
  const owned = currentUser?.id === comment.author.id;

  return (
    <li className="pb-5">
      <article>
        <div className="flex items-center">
          <div className="flex min-w-0 flex-1 items-start gap-1.5 px-4 py-3">
            <ProfileAvatar alt="" src={comment.author.avatarUrl} size="sm" className="size-5" />
            <div className="min-w-0">
              <h3 className="text-sm leading-6 font-normal break-words text-zinc-800">
                {comment.author.nickname}
              </h3>
              <time
                dateTime={comment.createdAt}
                className="text-xs leading-5 font-light text-neutral-400"
              >
                {formatPublishedTime(comment.createdAt, now)}
              </time>
            </div>
          </div>
          {owned && (
            <div className="pr-2">
              <ActionMenu
                onCloseAutoFocus={(event) => {
                  if (!selectedAction.current) return;
                  event.preventDefault();
                  if (selectedAction.current === 'edit') editor.current?.focus();
                  else document.getElementById('post-comments')?.focus({ preventScroll: true });
                  selectedAction.current = null;
                }}
                label="댓글 메뉴 열기"
                trigger={
                  <IconButton
                    ref={menuButton}
                    label={`${comment.author.nickname} 댓글 메뉴 열기`}
                    className="size-10"
                  >
                    <MoreVertIcon aria-hidden="true" className="size-6" />
                  </IconButton>
                }
                items={[
                  {
                    id: 'edit',
                    label: '수정',
                    onSelect: () => {
                      selectedAction.current = 'edit';
                      setEditing(true);
                    },
                  },
                  {
                    id: 'delete',
                    label: '삭제',
                    destructive: true,
                    onSelect: () => {
                      if (owned) {
                        selectedAction.current = 'delete';
                        onDelete(comment.id);
                      }
                    },
                  },
                ]}
              />
            </div>
          )}
        </div>
        {editing && owned ? (
          <div className="px-4 py-3">
            <CommentForm
              textareaRef={editor}
              author={comment.author}
              initialContent={comment.content}
              onCancel={() => {
                setEditing(false);
                menuButton.current?.focus();
              }}
              onSubmit={(content) => {
                if (!owned) return;
                onEdit(comment.id, content);
                setEditing(false);
              }}
            />
          </div>
        ) : (
          <p className="py-3 pr-4 pl-10 text-sm leading-6 font-light break-words whitespace-pre-wrap text-zinc-800">
            {comment.content}
          </p>
        )}
      </article>
    </li>
  );
}
