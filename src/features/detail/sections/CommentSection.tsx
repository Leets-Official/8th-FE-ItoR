/** 블로그 상세 페이지의 댓글 목록과 댓글 작성 영역입니다. */

import { useState, type ChangeEvent } from 'react';

import { PillButton } from '@/shared/ui/button/PillButton';
import { Spacer } from '@/shared/ui/spacing/Spacer';

import { CommentAuthor } from '../components/CommentAuthor';
import type { DetailComment } from '../model/detail';

type CommentSectionProps = {
  comments: readonly DetailComment[];
  currentUserNickname: string;
};

type CommentSummaryProps = {
  count: number;
};

function CommentSummary({ count }: CommentSummaryProps) {
  return (
    <div className="flex h-fit w-full max-w-[688px] gap-2 px-4 py-3">
      <h2 className="text-16-medium text-black">댓글</h2>
      <span className="text-14-medium text-point">{count}</span>
    </div>
  );
}

function EmptyCommentState() {
  return (
    <div className="flex h-fit w-full max-w-[688px] items-center justify-center px-4 py-3">
      <p className="text-14-light text-center text-gray-78">
        작성된 댓글이 없습니다.
        <br />
        응원의 첫 번째 댓글을 달아주세요
      </p>
    </div>
  );
}

function CommentList({ comments }: Pick<CommentSectionProps, 'comments'>) {
  return (
    <div className="flex h-fit w-full max-w-[688px] flex-col gap-2.5">
      {comments.map((comment) => (
        <article key={comment.id} className="flex h-fit w-full max-w-[688px] flex-col bg-white">
          <CommentAuthor
            nickname={comment.nickname}
            date={comment.date}
            showMenu={comment.isOwned}
          />
          <div className="flex h-fit w-full flex-col pl-[26px]">
            <div className="flex h-fit w-full max-w-[688px] gap-2.5 bg-white px-4 py-3">
              <span className="text-14-light text-gray-20">{comment.content}</span>
            </div>
          </div>
          <Spacer variant="20" />
        </article>
      ))}
    </div>
  );
}

function CommentForm({ nickname }: { nickname: string }) {
  const [comment, setComment] = useState('');
  const registerButtonVariant = comment.length > 0 ? 'dark' : 'neutral';

  function handleCommentChange(event: ChangeEvent<HTMLTextAreaElement>) {
    setComment(event.currentTarget.value);
  }

  return (
    <div className="flex h-fit w-full max-w-[688px] px-4 py-3">
      <div className="flex h-fit w-full flex-col rounded-[4px] border border-gray-90 py-2">
        <CommentAuthor nickname={nickname} />

        <div className="flex h-[112px] w-full px-4 py-3">
          <textarea
            aria-label="댓글 내용"
            className="text-14-light h-full w-full resize-none overflow-y-auto bg-transparent text-gray-20 outline-none placeholder:text-gray-56"
            onChange={handleCommentChange}
            placeholder="댓글을 입력하세요."
            rows={1}
            value={comment}
          />
        </div>

        <div className="flex w-full justify-end px-4 py-2">
          <PillButton variant={registerButtonVariant} text="등록" width={64} height={38} />
        </div>
      </div>
    </div>
  );
}

export function CommentSection({ comments, currentUserNickname }: CommentSectionProps) {
  return (
    <section className="flex h-fit w-full flex-col items-center justify-center border-b border-b-gray-96 bg-white">
      <CommentSummary count={comments.length} />
      <Spacer variant="20" />

      {comments.length > 0 ? <CommentList comments={comments} /> : <EmptyCommentState />}

      <Spacer variant="20" />
      <CommentForm nickname={currentUserNickname} />
      <Spacer variant="64" />
    </section>
  );
}
