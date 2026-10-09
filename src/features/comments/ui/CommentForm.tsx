import { useState, type Ref, type SubmitEvent } from 'react';

import { Button } from '@/shared/ui/primitives/button';
import { ProfileAvatar } from '@/shared/ui/ProfileAvatar';

import type { CommentAuthor } from '../model/comment';

interface CommentFormProps {
  author: CommentAuthor;
  onSubmit: (content: string) => void;
  initialContent?: string;
  onCancel?: () => void;
  textareaRef?: Ref<HTMLTextAreaElement>;
}

export function CommentForm({
  author,
  onSubmit,
  initialContent = '',
  onCancel,
  textareaRef,
}: CommentFormProps) {
  const [content, setContent] = useState(initialContent);
  const canSubmit = content.trim().length > 0;

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit) return;
    onSubmit(content.trim());
    setContent('');
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-sm border border-neutral-200 py-2">
      <div className="flex items-start gap-1.5 px-4 py-3">
        <ProfileAvatar alt="" src={author.avatarUrl} size="sm" className="size-5" />
        <span className="min-w-0 text-sm leading-6 font-normal break-words text-zinc-800">
          {author.nickname}
        </span>
      </div>
      <div className="px-4 py-3">
        <textarea
          ref={textareaRef}
          aria-label={onCancel ? '댓글 수정' : '댓글 입력'}
          autoFocus={Boolean(onCancel)}
          value={content}
          onChange={(event) => setContent(event.target.value)}
          placeholder="댓글을 입력하세요."
          rows={3}
          className="block min-h-22 w-full resize-y rounded-xs text-sm leading-6 font-light text-zinc-800 placeholder:text-neutral-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gitlog-action"
        />
      </div>
      <div className="mx-4 flex justify-end gap-2 border-t border-neutral-100 py-2">
        {onCancel && (
          <Button
            type="button"
            variant={null}
            onClick={onCancel}
            className="h-9 rounded-full border-neutral-400 bg-white px-3 text-sm font-normal text-neutral-500"
          >
            취소
          </Button>
        )}
        <Button
          type="submit"
          variant={null}
          disabled={!canSubmit}
          className="h-9 min-w-16 rounded-full bg-neutral-900 px-3 text-sm font-normal text-white hover:bg-neutral-800 disabled:border-neutral-400 disabled:bg-white disabled:text-neutral-400 disabled:opacity-100"
        >
          {onCancel ? '저장' : '등록'}
        </Button>
      </div>
    </form>
  );
}
