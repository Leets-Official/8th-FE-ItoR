import { useRef, useState } from 'react';

import { useCurrentTime } from '@/shared/hooks/useCurrentTime';

import type { CommentAuthor, PostComment } from '../model/comment';
import { CommentForm } from './CommentForm';
import { CommentItem } from './CommentItem';

interface CommentSectionProps {
  onLogin: () => void;
  currentUser: CommentAuthor | null;
  comments: PostComment[];
  onCommentsChange: (comments: PostComment[]) => void;
}

export function CommentSection({
  onLogin,
  currentUser,
  comments,
  onCommentsChange,
}: CommentSectionProps) {
  const [message, setMessage] = useState('');
  const heading = useRef<HTMLHeadingElement>(null);
  const now = useCurrentTime();

  function addComment(content: string) {
    if (!currentUser || !content.trim()) return;
    onCommentsChange([
      ...comments,
      {
        id: crypto.randomUUID(),
        author: currentUser,
        content: content.trim(),
        createdAt: new Date().toISOString(),
      },
    ]);
    setMessage('댓글을 등록했습니다.');
  }

  function editComment(id: string, content: string) {
    if (!currentUser || !content.trim()) return;
    onCommentsChange(
      comments.map((comment) =>
        comment.id === id && comment.author.id === currentUser.id
          ? { ...comment, content: content.trim() }
          : comment,
      ),
    );
    setMessage('댓글을 수정했습니다.');
    heading.current?.focus({ preventScroll: true });
  }

  function deleteComment(id: string) {
    if (!currentUser) return;
    onCommentsChange(
      comments.filter((comment) => comment.id !== id || comment.author.id !== currentUser.id),
    );
    setMessage('댓글을 삭제했습니다.');
    heading.current?.focus({ preventScroll: true });
  }
  return (
    <section
      aria-labelledby="post-comments"
      className="border-b border-neutral-100 bg-white pb-9 sm:pb-16"
    >
      <div className="mx-auto w-full max-w-[688px]">
        <h2
          ref={heading}
          id="post-comments"
          tabIndex={-1}
          className="flex scroll-mt-4 items-center gap-2 px-4 pt-4 pb-3 text-base leading-6 font-medium text-black focus-visible:outline-2 focus-visible:outline-gitlog-action"
        >
          댓글 <span className="font-normal text-gitlog-action">{comments.length}</span>
        </h2>
        {comments.length === 0 ? (
          <p className="my-5 px-4 py-3 text-center text-sm leading-6 font-light text-stone-300">
            작성된 댓글이 없습니다.
            <br />
            응원의 첫 번째 댓글을 달아주세요.
          </p>
        ) : (
          <ul aria-label="댓글 목록" className="mt-5 mb-5 space-y-2.5">
            {comments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                currentUser={currentUser}
                now={now}
                onEdit={editComment}
                onDelete={deleteComment}
              />
            ))}
          </ul>
        )}
        <p role="status" className="sr-only">
          {message}
        </p>
        <div className="px-4 py-3">
          {currentUser ? (
            <CommentForm key={currentUser.id} author={currentUser} onSubmit={addComment} />
          ) : (
            <button
              type="button"
              onClick={onLogin}
              className="w-full rounded-sm border border-neutral-200 px-4 py-5 text-left text-sm leading-6 font-light text-zinc-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gitlog-action"
            >
              <span className="block min-h-16">로그인을 하고 댓글을 달아보세요!</span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
