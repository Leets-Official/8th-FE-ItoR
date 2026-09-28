import { useState } from 'react';
import type { PostContent, PostContentType } from '@/types/post';

export interface EditorBlock {
  id: string;
  type: PostContentType;
  value: string;
}

const createBlock = (type: PostContentType, value = ''): EditorBlock => ({
  id: crypto.randomUUID(),
  type,
  value,
});

const toEditorBlocks = (contents: PostContent[]) =>
  contents.length === 0
    ? [createBlock('TEXT')]
    : [...contents]
        .sort((a, b) => a.contentOrder - b.contentOrder)
        .map(({ type, value }) => createBlock(type, value));

/**
 * 글쓰기 화면의 제목과 본문 블록(텍스트/이미지/코드)을 관리한다.
 * 블록 배열의 순서가 곧 contentOrder가 되어, 저장 후 조회할 때도 같은 순서로 보인다.
 */
export const usePostEditor = (initialTitle = '', initialContents: PostContent[] = []) => {
  const [title, setTitle] = useState(initialTitle);
  const [blocks, setBlocks] = useState(() => toEditorBlocks(initialContents));

  const updateBlock = (blockId: string, value: string) => {
    setBlocks((prev) => prev.map((block) => (block.id === blockId ? { ...block, value } : block)));
  };

  /** 이미지를 넣으면 바로 아래에 이어 쓸 수 있도록 빈 텍스트 블록도 함께 추가한다. */
  const addImage = (file: File) => {
    setBlocks((prev) => [
      ...prev,
      createBlock('IMAGE', URL.createObjectURL(file)),
      createBlock('TEXT'),
    ]);
  };

  const removeBlock = (blockId: string) => {
    setBlocks((prev) => {
      const target = prev.find((block) => block.id === blockId);
      if (target?.value.startsWith('blob:')) URL.revokeObjectURL(target.value);
      const nextBlocks = prev.filter((block) => block.id !== blockId);
      return nextBlocks.length === 0 ? [createBlock('TEXT')] : nextBlocks;
    });
  };

  const toContents = (): PostContent[] =>
    blocks
      .filter((block) => block.value.trim() !== '')
      .map(({ type, value }, index) => ({ contentOrder: index + 1, type, value }));

  return { title, setTitle, blocks, updateBlock, addImage, removeBlock, toContents };
};
