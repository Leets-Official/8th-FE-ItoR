import type { PostDraft } from '../model/postDraft';
import type { PostWriteBody } from '../model/postRequest';
import type { PostContentResponse } from '../model/postResponse';
import { buildPostContent, getPostDraftError } from './postDraft';

export function createPostBody(draft: PostDraft): PostWriteBody {
  const error = getPostDraftError(draft);
  if (error) throw new Error(error === 'title' ? '제목을 입력해주세요.' : '내용을 입력해주세요.');

  return {
    title: draft.title.trim(),
    contents: buildPostContent(draft.blocks).map((block, index): PostContentResponse => {
      if (block.type === 'image' && !/^https?:\/\//i.test(block.src)) {
        throw new Error('사진 업로드가 완료되지 않았습니다. 사진을 다시 선택해주세요.');
      }
      return {
        contentOrder: index + 1,
        content: block.type === 'text' ? block.text : block.src,
        contentType: block.type === 'text' ? 'TEXT' : 'IMAGE',
      };
    }),
  };
}
