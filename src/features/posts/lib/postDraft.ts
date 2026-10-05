import type { PostContentBlock } from '../model/post';
import type { PostDraft, PostDraftBlock } from '../model/postDraft';

export function getPostDraftError({ title, blocks }: PostDraft): 'title' | 'content' | null {
  if (!title.trim()) return 'title';
  if (!blocks.some((block) => block.type === 'image' || block.text.trim())) return 'content';
  return null;
}

export function buildPostContent(blocks: PostDraftBlock[]): PostContentBlock[] {
  return blocks
    .filter((block) => block.type === 'image' || block.text.trim())
    .map((block) =>
      block.type === 'text'
        ? { type: 'text', text: block.text.trim() }
        : {
            type: 'image',
            src: block.src,
            alt: block.alt,
            width: block.width,
            height: block.height,
          },
    );
}

export function insertPostImage(
  blocks: PostDraftBlock[],
  textId: string,
  start: number,
  end: number,
  image: Extract<PostDraftBlock, { type: 'image' }>,
  afterId: string,
): PostDraftBlock[] {
  return blocks.flatMap((block) => {
    if (block.id !== textId || block.type !== 'text') return [block];
    return [
      { ...block, text: block.text.slice(0, start) },
      image,
      { id: afterId, type: 'text' as const, text: block.text.slice(end) },
    ];
  });
}

export async function readPostImage(file: File) {
  if (!file.type.startsWith('image/')) throw new Error('이미지 파일을 선택해주세요.');
  const url = URL.createObjectURL(file);
  const image = new Image();
  try {
    await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve();
      image.onerror = () =>
        reject(new Error('이미지를 불러올 수 없습니다. 다른 사진을 선택해주세요.'));
      image.src = url;
    });
    return { src: url, alt: file.name, width: image.naturalWidth, height: image.naturalHeight };
  } catch (error) {
    URL.revokeObjectURL(url);
    throw error;
  }
}
