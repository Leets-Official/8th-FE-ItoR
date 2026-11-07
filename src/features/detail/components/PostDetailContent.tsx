import { useEffect } from 'react';

import { formatRelativeDate } from '@/shared/utils/date';

import { useDetailHeader } from '../hooks/useDetailHeader';
import { usePostDetail } from '../hooks/usePostDetail';
import { AuthorProfileSection } from '../sections/AuthorProfileSection';
import { BlogContentSection } from '../sections/BlogContentSection';
import { BlogTitleSection } from '../sections/BlogTitleSection';
import { CommentSection } from '../sections/CommentSection';

type PostDetailContentProps = {
  postId: string;
};

/** 상세 API 상태에 따라 게시글, 댓글, 작성자 영역을 조립합니다. */
export function PostDetailContent({ postId }: PostDetailContentProps) {
  const {
    auth,
    postReadResponse,
    currentTime,
    isLoading,
    isCommentPending,
    errorMessage,
    createComment,
    updateComment,
    removeComment,
    retry,
  } = usePostDetail(postId);
  const { setDetailHeaderState } = useDetailHeader();

  useEffect(() => {
    setDetailHeaderState({ postId, isOwner: Boolean(postReadResponse?.isOwner) });

    return () => setDetailHeaderState({ postId: '', isOwner: false });
  }, [postId, postReadResponse?.isOwner, setDetailHeaderState]);

  if (isLoading) {
    return (
      <p role="status" className="text-14-light px-4 py-12 text-gray-56">
        게시글을 불러오고 있습니다.
      </p>
    );
  }

  if (!postReadResponse) {
    return (
      <div className="flex flex-col items-center gap-3 px-4 py-12">
        <p role="alert" className="text-14-light text-negative">
          {errorMessage || '게시글을 불러오지 못했습니다.'}
        </p>
        <button type="button" onClick={retry} className="text-12-regular text-gray-20 underline">
          다시 시도
        </button>
      </div>
    );
  }

  const comments = postReadResponse.comments ?? [];

  return (
    <>
      {errorMessage ? (
        <p role="alert" className="text-12-regular px-4 py-2 text-negative">
          {errorMessage}
        </p>
      ) : null}

      <BlogTitleSection
        title={postReadResponse.title ?? ''}
        nickName={postReadResponse.nickName ?? ''}
        profileUrl={postReadResponse.profileUrl || undefined}
        createdAt={formatRelativeDate(postReadResponse.createdAt ?? '', currentTime)}
        commentCount={comments.length}
      />
      <BlogContentSection contents={postReadResponse.contents ?? []} />
      <CommentSection
        comments={comments}
        currentTime={currentTime}
        isLoggedIn={Boolean(auth)}
        nickName={auth?.nickname ?? ''}
        profileUrl={auth?.profilePicture ?? undefined}
        isCommentPending={isCommentPending}
        onCreateComment={createComment}
        onUpdateComment={updateComment}
        onDeleteComment={removeComment}
      />
      <AuthorProfileSection
        nickName={postReadResponse.nickName ?? ''}
        introduction={postReadResponse.introduction ?? ''}
        profileUrl={postReadResponse.profileUrl || undefined}
      />
    </>
  );
}
