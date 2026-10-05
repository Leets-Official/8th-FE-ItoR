/** 블로그 작성 페이지의 텍스트와 이미지 본문 편집 영역입니다. */

import { useEffect, useRef, useState, type ChangeEvent, type SyntheticEvent } from 'react';

import { Spacer } from '@/shared/ui/spacing/Spacer';

import { ArticleImageBlock } from '../components/ArticleImageBlock';
import type { ArticleBlock } from '../model/article';

type ArticleEditorSectionProps = {
  blocks: readonly ArticleBlock[];
  focusTextBlockId: string | null;
  onTextChange: (blockId: string, content: string, offset: number) => void;
  onTextSelectionChange: (blockId: string, offset: number) => void;
  onRemoveImage: (imageId: string) => void;
};

export function ArticleEditorSection({
  blocks,
  focusTextBlockId,
  onTextChange,
  onTextSelectionChange,
  onRemoveImage,
}: ArticleEditorSectionProps) {
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
  const textareaRefs = useRef(new Map<string, HTMLTextAreaElement>());
  const bottomBlankRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!focusTextBlockId) return;

    const textarea = textareaRefs.current.get(focusTextBlockId);
    textarea?.focus();
    textarea?.setSelectionRange(0, 0);
  }, [focusTextBlockId]);

  useEffect(() => {
    function clearImageSelection(event: PointerEvent) {
      if (!(event.target instanceof Element) || !event.target.closest('[data-article-image]')) {
        setSelectedImageId(null);
      }
    }

    document.addEventListener('pointerdown', clearImageSelection);
    return () => document.removeEventListener('pointerdown', clearImageSelection);
  }, []);

  function handleTextChange(blockId: string, event: ChangeEvent<HTMLTextAreaElement>) {
    const textarea = event.currentTarget;
    const previousHeight = textarea.offsetHeight;

    onTextChange(blockId, textarea.value, textarea.selectionStart);

    requestAnimationFrame(() => {
      const updatedTextarea = textareaRefs.current.get(blockId);
      const isLastBlock = blocks.at(-1)?.id === blockId;

      if (isLastBlock && (updatedTextarea?.offsetHeight ?? 0) > previousHeight) {
        bottomBlankRef.current?.scrollIntoView({ block: 'nearest' });
      }
    });
  }

  function handleTextSelectionChange(blockId: string, event: SyntheticEvent<HTMLTextAreaElement>) {
    onTextSelectionChange(blockId, event.currentTarget.selectionStart);
  }

  function setTextareaRef(blockId: string, textarea: HTMLTextAreaElement | null) {
    if (textarea) {
      textareaRefs.current.set(blockId, textarea);
      return;
    }

    textareaRefs.current.delete(blockId);
  }

  return (
    <section className="flex h-fit w-full flex-col items-center border-b bg-white">
      <Spacer variant="32" />

      {blocks.map((block, index) => {
        if (block.type === 'image') {
          return (
            <ArticleImageBlock
              key={block.id}
              image={block.image}
              isSelected={selectedImageId === block.image.id}
              onSelect={setSelectedImageId}
              onRemove={onRemoveImage}
            />
          );
        }

        return (
          <div key={block.id} className="flex h-fit w-full max-w-[688px] gap-2.5 px-4 py-3">
            <textarea
              ref={(textarea) => setTextareaRef(block.id, textarea)}
              name="content"
              aria-label="블로그 본문"
              className="text-14-light h-auto w-full resize-none overflow-hidden bg-transparent text-gray-20 outline-none [field-sizing:content] placeholder:text-gray-56"
              onChange={(event) => handleTextChange(block.id, event)}
              onSelect={(event) => handleTextSelectionChange(block.id, event)}
              placeholder={
                index === 0 && blocks.length === 1 ? '어떠한 것을 깨달았나요?' : undefined
              }
              rows={1}
              value={block.content}
            />
          </div>
        );
      })}

      <div ref={bottomBlankRef} className="flex w-full justify-center">
        <Spacer variant="32" />
      </div>
    </section>
  );
}
/** 블로그 작성 페이지의 텍스트와 이미지 본문 편집 영역입니다. */
