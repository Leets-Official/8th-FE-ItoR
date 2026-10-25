/** 블로그 상세 페이지의 댓글 목록과 로그인 상태별 댓글 작성 영역입니다. */

import { Spacer } from '@/shared/ui/spacing/Spacer';

import type { CommentGetDto } from '../api/detailApi';
import { CommentComposer } from '../components/CommentComposer';
import { CommentItem } from '../components/CommentItem';
import { COMMENT_SECTION_ID } from '../model/comment';

type CommentSectionProps = {
  comments: readonly CommentGetDto[];
  currentTime: Date;
  isLoggedIn: boolean;
  nickName: string;
  profileUrl?: string;
  isCommentPending: boolean;
  onCreateComment: (content: string) => Promise<boolean>;
  onUpdateComment: (commentId: number, content: string) => Promise<boolean>;
  onDeleteComment: (commentId: number) => Promise<void>;
};

type CommentSummaryProps = {
  count: number;
};

function CommentSummary({ count }: CommentSummaryProps) {
  return (
    <div
      id={COMMENT_SECTION_ID}
      className="flex h-fit w-full max-w-[688px] scroll-mt-20 gap-2 px-4 py-3"
    >
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

function CommentList({
  comments,
  currentTime,
  isCommentPending,
  onUpdateComment,
  onDeleteComment,
}: Pick<
  CommentSectionProps,
  'comments' | 'currentTime' | 'isCommentPending' | 'onUpdateComment' | 'onDeleteComment'
>) {
  return (
    <div className="flex h-fit w-full max-w-[688px] flex-col gap-2.5">
      {comments.map((commentGetDto, index) => (
        <CommentItem
          key={commentGetDto.commentId ?? `${commentGetDto.createdAt ?? 'comment'}-${index}`}
          commentGetDto={commentGetDto}
          currentTime={currentTime}
          isCommentPending={isCommentPending}
          onUpdateComment={onUpdateComment}
          onDeleteComment={onDeleteComment}
        />
      ))}
    </div>
  );
}

export function CommentSection({
  comments,
  currentTime,
  isLoggedIn,
  nickName,
  profileUrl,
  isCommentPending,
  onCreateComment,
  onUpdateComment,
  onDeleteComment,
}: CommentSectionProps) {
  return (
    <section className="flex h-fit w-full flex-col items-center justify-center border-b border-b-gray-96 bg-white">
      <CommentSummary count={comments.length} />
      <Spacer variant="20" />

      {comments.length > 0 ? (
        <CommentList
          comments={comments}
          currentTime={currentTime}
          isCommentPending={isCommentPending}
          onUpdateComment={onUpdateComment}
          onDeleteComment={onDeleteComment}
        />
      ) : (
        <EmptyCommentState />
      )}

      <Spacer variant="20" />
      <CommentComposer
        isLoggedIn={isLoggedIn}
        nickName={nickName}
        profileUrl={profileUrl}
        isCommentPending={isCommentPending}
        onCreateComment={onCreateComment}
      />
      <Spacer variant="64" />
    </section>
  );
}
