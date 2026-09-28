import { Trash2 } from 'lucide-react';
import type { EditorBlock } from '@/hooks/usePostEditor';
import { cn } from '@/utils/cn';

interface EditorBlockItemProps {
  block: EditorBlock;
  isFirst: boolean;
  onChange: (value: string) => void;
  onRemove: () => void;
}

function EditorBlockItem({ block, isFirst, onChange, onRemove }: EditorBlockItemProps) {
  if (block.type === 'IMAGE') {
    return (
      <figure className="group relative">
        <img src={block.value} alt="첨부한 이미지" className="w-full rounded-sm object-cover" />
        <button
          type="button"
          aria-label="이미지 삭제"
          onClick={onRemove}
          className="absolute top-2 right-2 flex size-8 items-center justify-center rounded-sm bg-white/90 text-ink opacity-0 shadow transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
        >
          <Trash2 size={16} aria-hidden />
        </button>
      </figure>
    );
  }

  return (
    <textarea
      aria-label={block.type === 'CODE' ? '코드 블록' : '본문'}
      value={block.value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={isFirst ? '어떠한 것을 깃로그 할까요?' : ''}
      rows={isFirst ? 8 : 2}
      className={cn(
        '[field-sizing:content] w-full resize-none outline-none placeholder:text-gray-400',
        block.type === 'CODE'
          ? 'rounded-xs bg-code p-4 font-mono text-sm text-gray-100'
          : 'text-sm leading-relaxed font-light text-gray-700 md:text-base',
      )}
    />
  );
}

export default EditorBlockItem;
