import { useState } from 'react';
import EmptyState from '@/components/common/EmptyState';
import { useAuth } from '@/hooks/useAuth';
import { useLoginModal } from '@/hooks/useLoginModal';
import { useToast } from '@/hooks/useToast';
import type { Comment } from '@/types/comment';
import CommentEditor from './CommentEditor';
import CommentItem from './CommentItem';

interface CommentSectionProps {
  initialComments: Comment[];
}

/**
 * 댓글은 로그인하지 않아도 볼 수 있고, 작성은 로그인해야 할 수 있다.
 * 2주차에는 API 대신 화면 안의 상태로만 추가/수정/삭제한다.
 */
function CommentSection({ initialComments }: CommentSectionProps) {
  const { user } = useAuth();
  const { openLoginModal } = useLoginModal();
  const { showToast } = useToast();
  const [comments, setComments] = useState(initialComments);

  const addComment = (content: string) => {
    if (!user) return;
    setComments((prev) => [
      ...prev,
      { id: Date.now(), content, author: user, createdAt: new Date().toISOString() },
    ]);
    showToast('success', '댓글이 등록되었습니다!');
  };

  const editComment = (commentId: number, content: string) => {
    setComments((prev) =>
      prev.map((comment) => (comment.id === commentId ? { ...comment, content } : comment)),
    );
    showToast('success', '댓글이 수정되었습니다!');
  };

  const deleteComment = (commentId: number) => {
    setComments((prev) => prev.filter((comment) => comment.id !== commentId));
    showToast('success', '댓글이 삭제되었습니다!');
  };

  return (
    <section id="comments" aria-labelledby="comments-title" className="scroll-mt-20">
      <h2 id="comments-title" className="text-sm font-medium text-ink">
        댓글 <span className="text-point">{comments.length}</span>
      </h2>

      {comments.length === 0 ? (
        <EmptyState
          message="작성된 댓글이 없습니다."
          description="제일 첫 번째 댓글을 달아주세요."
        />
      ) : (
        <ul className="mt-2 mb-6">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              isMine={comment.author.id === user?.id}
              onEdit={editComment}
              onDelete={deleteComment}
            />
          ))}
        </ul>
      )}

      {user ? (
        <CommentEditor author={user} onSubmit={addComment} />
      ) : (
        <button
          type="button"
          onClick={openLoginModal}
          className="block h-20 w-full rounded-xs border border-gray-100 px-4 py-3 text-left text-sm text-gray-500 transition-colors hover:border-gray-300 focus-visible:outline-2 focus-visible:outline-point"
        >
          로그인을 하고 댓글을 달아보세요!
        </button>
      )}
    </section>
  );
}

export default CommentSection;
