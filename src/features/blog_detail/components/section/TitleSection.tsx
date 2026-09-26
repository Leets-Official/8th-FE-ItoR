import { CustomBlank } from '@/shared/ui/blank/CustomBlank';
import { PostMetadata } from '@/shared/ui/post/PostMetadata';
import { CustomTextBox } from '@/shared/ui/text/text_box/CustomTextBox';

/** @returns 블로그 글의 제목과 작성 정보를 표시하는 영역 */
export function TitleSection() {
  return (
    <section className="flex h-fit w-full flex-col items-center justify-center border-b border-b-gray-96 bg-white">
      <CustomBlank variant="64" />

      <div className="flex h-fit w-full max-w-[688px] flex-col py-3">
        <CustomTextBox variant="24" title="24 Title one line" />

        <CustomBlank variant="32" />

        <PostMetadata nickname="닉네임" createdAt="Feb 17.2025." commentCount={0} />
      </div>
    </section>
  );
}
