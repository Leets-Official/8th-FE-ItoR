/** 블로그 상세 페이지의 제목과 작성 정보 영역입니다. */

import { Spacer } from '@/shared/ui/spacing/Spacer';
import { PostMetadata } from '@/shared/ui/post/PostMetadata';
import { TextContent } from '@/shared/ui/text/TextContent';

type BlogTitleSectionProps = {
  title: string;
  nickName: string;
  profileUrl?: string;
  createdAt: string;
  commentCount: number;
};

export function BlogTitleSection({
  title,
  nickName,
  profileUrl,
  createdAt,
  commentCount,
}: BlogTitleSectionProps) {
  return (
    <section className="flex h-fit w-full flex-col items-center justify-center border-b border-b-gray-96 bg-white">
      <Spacer variant="64" />

      <div className="flex h-fit w-full max-w-[688px] flex-col py-3">
        <TextContent variant="24" title={title} headingLevel={1} />

        <Spacer variant="32" />

        <PostMetadata
          nickname={nickName}
          createdAt={createdAt}
          commentCount={commentCount}
          profileImageUrl={profileUrl}
        />
      </div>
    </section>
  );
}
