import { useState, type ChangeEvent } from 'react';

import { MoreVertIcon } from '@/shared/assets/icons/icons';
import { CustomBlank } from '@/shared/ui/blank/CustomBlank';
import { ActiveRoundButton } from '@/shared/ui/button/ActiveRoundButton';

const HAS_PREVIEW_COMMENTS = true;

type CommentSummaryProps = {
  count: number;
};

type CommentAuthorBaseProps = {
  nickname: string;
};

type CommentAuthorProps = CommentAuthorBaseProps &
  (
    | {
        variant: 'simple';
        date?: never;
        onMenuClick?: never;
      }
    | {
        variant: 'dated';
        date: string;
        onMenuClick?: never;
      }
    | {
        variant: 'owned';
        date: string;
        onMenuClick?: () => void;
      }
  );

type CommentBodyProps = {
  content: string;
};

/** @returns 댓글 제목과 현재 댓글 수를 표시하는 영역 */
function CommentSummary({ count }: CommentSummaryProps) {
  return (
    <div className="flex h-fit w-full max-w-[688px] gap-2 px-4 py-3">
      <h2 className="text-16-medium text-black">댓글</h2>
      <span className="text-14-medium text-point">{count}</span>
    </div>
  );
}

/** @returns 작성된 댓글이 없을 때 표시하는 안내 문구 */
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

/** @returns 날짜와 메뉴 아이콘 구성에 맞는 댓글 작성자 정보 */
function CommentAuthor({ variant, nickname, date, onMenuClick }: CommentAuthorProps) {
  return (
    <div className="flex h-fit w-full items-center">
      <div className="flex w-full items-center gap-1.5 px-4 py-3">
        <span aria-hidden="true" className="h-5 w-5 rounded-full bg-black" />

        {variant === 'simple' ? (
          <span className="text-14-regular text-gray-20">{nickname}</span>
        ) : (
          <div className="flex h-fit w-fit flex-col">
            <span className="text-14-regular text-gray-20">{nickname}</span>
            <span className="text-12-light text-gray-56">{date}</span>
          </div>
        )}
      </div>

      {variant === 'owned' ? (
        <button
          type="button"
          aria-label="댓글 메뉴 열기"
          className="flex h-fit w-fit gap-2.5"
          onClick={onMenuClick}
        >
          <MoreVertIcon className="h-8 w-8" />
        </button>
      ) : null}
    </div>
  );
}

/** @returns 작성된 댓글의 본문 */
function CommentBody({ content }: CommentBodyProps) {
  return (
    <div className="flex h-fit w-full flex-col pl-[26px]">
      <div className="flex h-fit w-full max-w-[688px] gap-2.5 bg-white px-4 py-3">
        <span className="text-14-light text-gray-20">{content}</span>
      </div>
    </div>
  );
}

/** @returns 작성된 댓글 목록 */
function CommentList({ nickname }: CommentAuthorBaseProps) {
  return (
    <div className="flex h-fit w-full max-w-[688px] flex-col gap-2.5">
      <article className="flex h-fit w-full max-w-[688px] flex-col bg-white">
        <CommentAuthor variant="owned" nickname={nickname} date="Feb 17.2025." />
        <CommentBody content="댓글 표시되는 곳" />
        <CustomBlank variant="20" />
      </article>
    </div>
  );
}

/** @returns 고정된 입력 영역 안에서 긴 댓글을 작성할 수 있는 폼 */
function CommentForm({ nickname }: CommentAuthorBaseProps) {
  const [comment, setComment] = useState('');
  const hasComment = comment.length > 0;
  const registerButtonVariant = hasComment ? 'black' : 'border';

  function handleCommentChange(event: ChangeEvent<HTMLTextAreaElement>) {
    setComment(event.currentTarget.value);
  }

  return (
    <div className="flex h-fit w-full max-w-[688px] px-4 py-3">
      <div className="flex h-fit w-full flex-col rounded-[4px] border border-gray-90 py-2">
        <CommentAuthor variant="simple" nickname={nickname} />

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
          <ActiveRoundButton variant={registerButtonVariant} text="등록" width={64} height={38} />
        </div>
      </div>
    </div>
  );
}

/** @returns 댓글 목록 또는 빈 상태와 댓글 작성 폼을 표시하는 영역 */
export function CommentSection() {
  return (
    <section className="flex h-fit w-full flex-col items-center justify-center border-b border-b-gray-96 bg-white">
      <CommentSummary count={HAS_PREVIEW_COMMENTS ? 1 : 0} />
      <CustomBlank variant="20" />

      {HAS_PREVIEW_COMMENTS ? <CommentList nickname="닉네임" /> : <EmptyCommentState />}

      <CustomBlank variant="20" />
      <CommentForm nickname="닉네임" />
      <CustomBlank variant="64" />
    </section>
  );
}
