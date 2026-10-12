import { CommentField } from './CommentField';
import { CommentItem } from './CommentItem';
import { useCreateComment, useDeleteComment } from '../api/commentQueries';
import type { PostComment } from '../model/types';
import type { User } from '@/features/user';
import { Blank, showToast } from '@/shared/ui';

interface CommentSectionProps {
  postId: number;
  comments: PostComment[];
  // 없으면 비로그인 상태
  currentUser?: User;
  onLoginRequest: () => void;
}

export function CommentSection({
  postId,
  comments,
  currentUser,
  onLoginRequest,
}: CommentSectionProps) {
  const { mutate: createComment } = useCreateComment(postId);
  const { mutate: deleteComment } = useDeleteComment(postId);

  function handleCommentSubmit(content: string) {
    if (!currentUser) return;

    createComment({
      postId,
      content,
      author: { nickname: currentUser.nickname, profileImageUrl: currentUser.profileImageUrl },
    });
  }

  function handleCommentDelete(commentId: number) {
    deleteComment(
      { postId, commentId },
      {
        onSuccess: () => showToast('positive', '삭제가 완료되었습니다!'),
        onError: () => showToast('negative', '댓글을 삭제하지 못했습니다.'),
      },
    );
  }

  // 사용자 id가 아직 없어 닉네임으로 본인 댓글인지 판단한다
  function isMyComment(comment: PostComment) {
    return currentUser?.nickname === comment.author.nickname;
  }

  return (
    <section aria-label="댓글" className="flex w-full flex-col">
      <h2 className="flex gap-2 px-4 pt-4 pb-3 text-16">
        <span className="font-medium text-black">댓글</span>
        <span className="text-point">{comments.length}</span>
      </h2>
      <Blank size={20} />
      {comments.length === 0 ? (
        <p className="px-4 py-3 text-center text-14 font-light whitespace-pre-line text-gray-78">
          {'작성된 댓글이 없습니다.\n응원의 첫 번째 댓글을 달아주세요.'}
        </p>
      ) : (
        <ul className="flex flex-col">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              onDelete={isMyComment(comment) ? () => handleCommentDelete(comment.id) : undefined}
            />
          ))}
        </ul>
      )}
      <Blank size={20} />
      <div className="px-4 py-3">
        <CommentField
          currentUser={currentUser}
          onLoginRequest={onLoginRequest}
          onSubmit={handleCommentSubmit}
        />
      </div>
    </section>
  );
}
