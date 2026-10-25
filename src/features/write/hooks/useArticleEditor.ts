import { useEffect, useRef, useState, type ChangeEvent } from 'react';

import type { ArticleBlock, ArticleImage, ArticleTextBlock } from '../model/article';

type TextInsertionPoint = {
  blockId: string;
  offset: number;
};

function createTextBlock(content = ''): ArticleTextBlock {
  return {
    id: crypto.randomUUID(),
    type: 'text',
    content,
  };
}

function createImage(file: File): ArticleImage {
  return {
    id: crypto.randomUUID(),
    src: URL.createObjectURL(file),
    alt: file.name,
  };
}

/** @returns 텍스트와 이미지 블록의 순서, 입력 위치, 이미지 파일을 관리하는 본문 편집 상태 */
export function useArticleEditor() {
  const imageInputRef = useRef<HTMLInputElement>(null);
  const imageUrlsRef = useRef(new Set<string>());
  const insertionPointRef = useRef<TextInsertionPoint | null>(null);
  const [blocks, setBlocks] = useState<ArticleBlock[]>(() => [createTextBlock()]);
  const [focusTextBlockId, setFocusTextBlockId] = useState<string | null>(null);

  useEffect(() => {
    const imageUrls = imageUrlsRef.current;

    return () => {
      imageUrls.forEach((imageUrl) => URL.revokeObjectURL(imageUrl));
    };
  }, []);

  function openImagePicker() {
    imageInputRef.current?.click();
  }

  function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const images = Array.from(event.currentTarget.files ?? []).map(createImage);

    if (images.length === 0) return;

    images.forEach((image) => imageUrlsRef.current.add(image.src));

    const nextTextBlock = createTextBlock();

    // TODO(API): 본문 블록 API 연결 시 현재 입력 순서를 서버 전송 형식으로 직렬화합니다.
    setBlocks((currentBlocks) => {
      const insertionPoint = insertionPointRef.current;
      const targetIndex = insertionPoint
        ? currentBlocks.findIndex((block) => block.id === insertionPoint.blockId)
        : currentBlocks.findLastIndex((block) => block.type === 'text');
      const targetBlock = currentBlocks[targetIndex];

      if (!targetBlock || targetBlock.type !== 'text') {
        return [
          ...currentBlocks,
          ...images.map((image) => ({ id: image.id, type: 'image' as const, image })),
          nextTextBlock,
        ];
      }

      const offset = Math.min(
        insertionPoint?.offset ?? targetBlock.content.length,
        targetBlock.content.length,
      );
      const previousContent = targetBlock.content.slice(0, offset);
      nextTextBlock.content = targetBlock.content.slice(offset);

      const insertedBlocks: ArticleBlock[] = [
        ...(previousContent ? [{ ...targetBlock, content: previousContent }] : []),
        ...images.map((image) => ({ id: image.id, type: 'image' as const, image })),
        nextTextBlock,
      ];

      return [
        ...currentBlocks.slice(0, targetIndex),
        ...insertedBlocks,
        ...currentBlocks.slice(targetIndex + 1),
      ];
    });

    insertionPointRef.current = { blockId: nextTextBlock.id, offset: 0 };
    setFocusTextBlockId(nextTextBlock.id);
    event.currentTarget.value = '';
  }

  function updateTextBlock(blockId: string, content: string, offset: number) {
    setBlocks((currentBlocks) =>
      currentBlocks.map((block) =>
        block.id === blockId && block.type === 'text' ? { ...block, content } : block,
      ),
    );
    insertionPointRef.current = { blockId, offset };
  }

  function updateInsertionPoint(blockId: string, offset: number) {
    insertionPointRef.current = { blockId, offset };
  }

  function removeImageBlock(imageId: string) {
    const targetBlock = blocks.find(
      (block) => block.type === 'image' && block.image.id === imageId,
    );

    if (targetBlock?.type === 'image') {
      URL.revokeObjectURL(targetBlock.image.src);
      imageUrlsRef.current.delete(targetBlock.image.src);
    }

    setBlocks((currentBlocks) => {
      const imageIndex = currentBlocks.findIndex(
        (block) => block.type === 'image' && block.image.id === imageId,
      );
      const previousBlock = currentBlocks[imageIndex - 1];
      const nextBlock = currentBlocks[imageIndex + 1];

      if (previousBlock?.type === 'text' && nextBlock?.type === 'text') {
        return [
          ...currentBlocks.slice(0, imageIndex - 1),
          { ...previousBlock, content: previousBlock.content + nextBlock.content },
          ...currentBlocks.slice(imageIndex + 2),
        ];
      }

      return currentBlocks.filter((block) => block.type !== 'image' || block.image.id !== imageId);
    });
  }

  return {
    blocks,
    focusTextBlockId,
    imageInputRef,
    openImagePicker,
    handleImageChange,
    updateTextBlock,
    updateInsertionPoint,
    removeImageBlock,
  };
}
