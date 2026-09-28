import { useId, useState, type FormEvent } from 'react';
import Avatar from '@/components/common/Avatar';
import Button from '@/components/common/Button';
import type { Author } from '@/types/user';
import { isBlank } from '@/utils/validators';

interface CommentEditorProps {
  author: Author;
  initialContent?: string;
  submitLabel?: string;
  onSubmit: (content: string) => void;
  onCancel?: () => void;
}

/** 댓글 작성과 수정에 같이 쓰는 입력 상자. 내용이 있어야 등록 버튼이 활성화된다. */
function CommentEditor({
  author,
  initialContent = '',
  submitLabel = '등록',
  onSubmit,
  onCancel,
}: CommentEditorProps) {
  const [content, setContent] = useState(initialContent);
  const textareaId = useId();
  const isEmpty = isBlank(content);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isEmpty) return;
    onSubmit(content.trim());
    setContent('');
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xs border border-gray-100 bg-white focus-within:border-gray-300"
    >
      <div className="flex items-center gap-1.5 px-4 pt-3 text-xs text-ink">
        <Avatar src={author.profileImageUrl} alt="" size="xs" />
        {author.nickname}
      </div>
      <label htmlFor={textareaId} className="sr-only">
        댓글 내용
      </label>
      <textarea
        id={textareaId}
        value={content}
        onChange={(event) => setContent(event.target.value)}
        placeholder="댓글을 입력하세요."
        rows={3}
        className="block [field-sizing:content] min-h-20 w-full resize-none px-4 py-3 text-sm leading-relaxed font-light text-ink outline-none placeholder:text-gray-400"
      />
      <div className="flex justify-end gap-2 border-t border-gray-50 px-4 py-2">
        {onCancel && (
          <Button variant="outline-gray" size="sm" onClick={onCancel}>
            취소
          </Button>
        )}
        <Button
          type="submit"
          variant={isEmpty ? 'outline-gray' : 'solid-ink'}
          size="sm"
          disabled={isEmpty}
          className="disabled:opacity-100"
        >
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}

export default CommentEditor;
