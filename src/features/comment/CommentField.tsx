import { useRef, useState, type FocusEvent, type SubmitEvent } from 'react';
import { CommentAuthor } from './CommentAuthor';
import { submitOnModifierEnter } from './submitOnModifierEnter';
import type { User } from '@/features/user';
import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui';

const BOX_CLASS = 'rounded-sm border border-gray-90 py-2';
const TEXTAREA_CLASS =
  'block w-full resize-none px-4 py-3 text-14 font-light text-gray-20 outline-none';

interface CommentFieldProps {
  // 없으면 비로그인 상태로 보고 입력 대신 로그인을 요청한다
  currentUser?: User;
  onLoginRequest: () => void;
  onSubmit?: (content: string) => void;
  className?: string;
}

export function CommentField({
  currentUser,
  onLoginRequest,
  onSubmit,
  className,
}: CommentFieldProps) {
  const [content, setContent] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  // 공백만 입력해도 등록을 누를 수 있어야 필드를 비울 수 있다
  const hasInput = content.length > 0;

  function handleGuestFocus(event: FocusEvent<HTMLTextAreaElement>) {
    event.currentTarget.blur();
    onLoginRequest();
  }

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedContent = content.trim();
    // 공백만 입력했으면 등록하지 않고 필드만 비운다
    if (trimmedContent) onSubmit?.(trimmedContent);

    setContent('');
    // 이어서 입력할 수 있게 포커스를 되돌려 모바일 키패드가 닫히지 않게 한다
    textareaRef.current?.focus();
  }

  if (!currentUser) {
    return (
      <div className={cn(BOX_CLASS, className)}>
        <textarea
          aria-label="댓글 입력"
          aria-readonly
          readOnly
          placeholder="로그인을 하고 댓글을 달아보세요!"
          rows={3}
          className={cn(TEXTAREA_CLASS, 'placeholder:text-gray-20')}
          onFocus={handleGuestFocus}
        />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={cn(BOX_CLASS, className)}>
      <CommentAuthor
        nickname={currentUser.nickname}
        profileImageUrl={currentUser.profileImageUrl}
        className="px-4 py-3"
      />
      <textarea
        ref={textareaRef}
        aria-label="댓글 입력"
        placeholder="댓글을 입력하세요."
        value={content}
        // 시안: 빈 상태는 112px, 입력하면 내용 길이만큼 늘어난다
        className={cn(TEXTAREA_CLASS, 'field-sizing-content min-h-28 placeholder:text-gray-56')}
        onChange={(event) => setContent(event.target.value)}
        onKeyDown={submitOnModifierEnter}
      />
      <div className="border-t border-gray-96" />
      <div className="flex justify-end px-4 py-2">
        {/* 입력 전에는 outline, 입력하면 black으로 바뀌어 등록 가능 상태를 보여준다. 시안의 등록 버튼은 기본 pill(40px)보다 작은 64×38 고정 크기 */}
        <Button
          type="submit"
          variant={hasInput ? 'black' : 'outline'}
          disabled={!hasInput}
          className="h-[38px] w-16"
          // 버튼이 포커스를 가져가면 입력창이 blur되어 모바일 키패드가 닫힌다
          onPointerDown={(event) => event.preventDefault()}
        >
          등록
        </Button>
      </div>
    </form>
  );
}
