import { CustomTextBox } from '@/shared/ui/text/text_box/CustomTextBox';

/** @returns 작성 정보 사이에 표시하는 구분점 */
function MetadataDivider() {
  return (
    <span aria-hidden="true" className="flex h-5 w-3 items-center justify-center">
      <span className="h-0.5 w-0.5 rounded-full bg-gray-90" />
    </span>
  );
}

/** @returns 작성자의 프로필, 닉네임, 작성일과 댓글 수 */
function PostMetadata() {
  return (
    <div className="flex w-fit items-center px-4 py-3">
      <div className="flex items-center gap-1.5">
        <span aria-hidden="true" className="h-5 w-5 rounded-full bg-black" />
        <span className="text-12-regular text-gray-20">닉네임</span>
      </div>

      <MetadataDivider />
      <span className="text-12-light text-gray-56">Feb 17.2025.</span>
      <MetadataDivider />
      <span className="text-12-light text-gray-56">댓글0</span>
    </div>
  );
}

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
        <PostMetadata />
      </div>

      <PostThumbnail />
    </article>
  );
}
