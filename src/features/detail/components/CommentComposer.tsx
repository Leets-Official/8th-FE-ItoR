import { useState, type ChangeEvent, type FormEvent } from 'react';

import { PillButton } from '@/shared/ui/button/PillButton';

import { CommentAuthor } from './CommentAuthor';

type CommentComposerProps = {
  isLoggedIn: boolean;
  nickName: string;
  profileUrl?: string;
  isCommentPending: boolean;
  onCreateComment: (content: string) => Promise<boolean>;
};

function GuestCommentPrompt() {
  return (
    <div className="flex w-full max-w-[688px] flex-col items-center justify-center px-4 py-3">
      <div className="flex w-full flex-col rounded-[4px] border border-gray-90 py-2">
        <div className="flex w-full items-center justify-center px-4 py-3">
          <p className="text-14-light h-[66px] w-full text-gray-20">
            로그인을 하고 댓글을 달아보세요!
          </p>
        </div>
      </div>
    </div>
  );
}

function CommentForm({
  nickName,
  profileUrl,
  isCommentPending,
  onCreateComment,
}: Omit<CommentComposerProps, 'isLoggedIn'>) {
  const [content, setContent] = useState('');
  const trimmedContent = content.trim();
  const canSubmit = trimmedContent.length > 0 && !isCommentPending;
  const registerButtonVariant = canSubmit ? 'dark' : 'neutral';

  function handleContentChange(event: ChangeEvent<HTMLTextAreaElement>) {
    setContent(event.currentTarget.value);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit) {
      return;
    }

    const isCreated = await onCreateComment(trimmedContent);
    if (isCreated) {
      setContent('');
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex h-fit w-full max-w-[688px] px-4 py-3">
      <div className="flex h-fit w-full flex-col rounded-[4px] border border-gray-90 py-2">
        <CommentAuthor nickName={nickName} profileUrl={profileUrl} />

        <div className="flex h-[112px] w-full px-4 py-3">
          <textarea
            aria-label="댓글 내용"
            className="text-14-light h-full w-full resize-none overflow-y-auto bg-transparent text-gray-20 outline-none placeholder:text-gray-56"
            onChange={handleContentChange}
            placeholder="댓글을 입력하세요."
            rows={1}
            value={content}
          />
        </div>

        <div className="flex w-full justify-end px-4 py-2">
          <PillButton
            type="submit"
            variant={registerButtonVariant}
            text="등록"
            width={64}
            height={38}
            disabled={!canSubmit}
          />
        </div>
      </div>
    </form>
  );
}

/** 로그인 상태에 맞는 댓글 작성 영역을 표시합니다. */
export function CommentComposer({
  isLoggedIn,
  nickName,
  profileUrl,
  isCommentPending,
  onCreateComment,
}: CommentComposerProps) {
  return (
    <div className="flex w-full justify-center">
      {isLoggedIn ? (
        <CommentForm
          nickName={nickName}
          profileUrl={profileUrl}
          isCommentPending={isCommentPending}
          onCreateComment={onCreateComment}
        />
      ) : (
        <GuestCommentPrompt />
      )}
    </div>
  );
}
