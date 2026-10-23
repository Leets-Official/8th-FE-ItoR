import { CommentField } from './CommentField';
import { CommentItem } from './CommentItem';
import { useCreateComment, useDeleteComment } from '../api/commentQueries';
import type { PostComment } from '../model/types';
import type { User } from '@/features/user';
import { Blank, showToast } from '@/shared/ui';

interface CommentSectionProps {
  postId: string;
  comments: PostComment[];
  // 없으면 비로그인 상태
  currentUser?: User;
  onLoginRequest: () => void;
  // 등록·삭제가 성공하면 댓글 목록을 다시 불러오게 알린다. Promise를 돌려주면 다시 받아 올 때까지 기다린다
  onCommentChange?: () => Promise<unknown> | void;
}

export function CommentSection({
  postId,
  comments,
  currentUser,
  onLoginRequest,
  onCommentChange,
}: CommentSectionProps) {
  const { mutate: createComment } = useCreateComment(onCommentChange);
  const { mutate: deleteComment } = useDeleteComment(onCommentChange);

  function handleCommentSubmit(content: string) {
    if (!currentUser) return;

    createComment(
      { postId, content },
      { onError: () => showToast('negative', '댓글을 등록하지 못했습니다.') },
    );
  }

  function handleCommentDelete(commentId: number) {
    deleteComment(commentId, {
      onSuccess: () => showToast('positive', '삭제가 완료되었습니다!'),
      onError: () => showToast('negative', '댓글을 삭제하지 못했습니다.'),
    });
  }

  // 로그아웃 직후 다시 불러오기 전의 응답이 남아 있어도 삭제 메뉴를 보이지 않게 로그인 여부도 본다
  function isMyComment(comment: PostComment) {
    return Boolean(currentUser) && comment.isOwner;
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
