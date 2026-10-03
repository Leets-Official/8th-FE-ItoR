import { useState, type FocusEvent } from 'react';
import { LoginModal } from '@/features/auth';
import { Blank } from '@/shared/ui';

interface CommentSectionProps {
  commentCount: number;
  isLoggedIn: boolean;
}

// 댓글 작성 행동은 API 연동 때 features/write-comment로 분리해 이 위젯에서 조합한다
export function CommentSection({ commentCount, isLoggedIn }: CommentSectionProps) {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  function handleCommentFocus(event: FocusEvent<HTMLTextAreaElement>) {
    if (isLoggedIn) return;

    event.currentTarget.blur();
    setIsLoginModalOpen(true);
  }

  return (
    <>
      <section aria-label="댓글" className="flex w-full flex-col">
        <h2 className="flex gap-2 px-4 pt-4 pb-3 text-16">
          <span className="font-medium text-black">댓글</span>
          <span className="text-point">{commentCount}</span>
        </h2>
        <Blank size={20} />
        {commentCount === 0 && (
          <p className="px-4 py-3 text-center text-14 font-light whitespace-pre-line text-gray-78">
            {'작성된 댓글이 없습니다.\n응원의 첫 번째 댓글을 달아주세요.'}
          </p>
        )}
        <Blank size={20} />
        <div className="px-4 py-3">
          <div className="rounded-sm border border-gray-90 py-2">
            <textarea
              aria-label="댓글 입력"
              aria-readonly={!isLoggedIn}
              placeholder={isLoggedIn ? '댓글을 입력해주세요.' : '로그인을 하고 댓글을 달아보세요!'}
              readOnly={!isLoggedIn}
              rows={3}
              className="block w-full resize-none px-4 py-3 text-14 font-light text-gray-20 outline-none placeholder:text-gray-56"
              onFocus={handleCommentFocus}
            />
          </div>
        </div>
      </section>
      <LoginModal open={isLoginModalOpen} onOpenChange={setIsLoginModalOpen} />
    </>
  );
}
