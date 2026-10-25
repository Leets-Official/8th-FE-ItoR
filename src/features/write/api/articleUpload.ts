import { uploadImage } from '@/shared/api/imageUpload';
import type { ContentDto } from '@/shared/api/postApi';

import type { ArticleBlock } from '../model/article';

function hasContent(block: ArticleBlock) {
  return block.type === 'image' || block.content.trim().length > 0;
}

/** 편집 블록의 순서를 유지하면서 이미지를 업로드하고 API 본문으로 변환합니다. */
export async function createPostContents(blocks: readonly ArticleBlock[]) {
  const contentBlocks = blocks.filter(hasContent);

  return Promise.all(
    contentBlocks.map<Promise<ContentDto>>(async (block, index) => {
      if (block.type === 'image') {
        return {
          contentOrder: index + 1,
          content: block.image.file ? await uploadImage(block.image.file) : block.image.src,
          contentType: 'IMAGE',
        };
      }

      return {
        contentOrder: index + 1,
        content: block.content,
        contentType: 'TEXT',
      };
    }),
  );
}
