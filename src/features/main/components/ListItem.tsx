import { PostMetadata } from '@/shared/ui/post/PostMetadata';
import { CustomTextBox } from '@/shared/ui/text/text_box/CustomTextBox';

/** @returns 블로그 글 오른쪽에 표시하는 썸네일 영역 */
function PostThumbnail() {
  return (
    <div className="flex h-[116px] w-[124px] shrink-0 items-center justify-center px-4 py-3">
      <div className="h-[92px] w-[92px] rounded-[2px] bg-black" />
    </div>
  );
}

/** @returns 블로그 글의 내용, 작성 정보, 썸네일을 표시하는 목록 항목 */
export function ListItem() {
  return (
    <article className="flex w-full max-w-[688px] items-center gap-4 border-b border-b-gray-96 bg-white py-2">
      <div className="flex min-w-0 flex-1 flex-col">
        <CustomTextBox variant="16" title="16 Title one line" subtitle="어쩌구 저쩌구" />
        <PostMetadata nickname="닉네임" createdAt="Feb 17.2025." commentCount={0} />
      </div>

      <PostThumbnail />
    </article>
  );
}
