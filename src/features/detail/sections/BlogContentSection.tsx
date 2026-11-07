/** 블로그 상세 페이지의 텍스트와 이미지 본문 블록을 표시하는 영역입니다. */

import { Spacer } from '@/shared/ui/spacing/Spacer';
import { TextContent } from '@/shared/ui/text/TextContent';
import type { ContentDto } from '@/shared/api/postApi';

import { ArticleImageBlock } from '../components/ArticleImageBlock';

type BlogContentSectionProps = {
  contents: readonly ContentDto[];
};

export function BlogContentSection({ contents }: BlogContentSectionProps) {
  const orderedContents = contents.toSorted(
    (firstContent, secondContent) =>
      (firstContent.contentOrder ?? 0) - (secondContent.contentOrder ?? 0),
  );
  const firstImageIndex = orderedContents.findIndex(
    (contentDto) => contentDto.contentType === 'IMAGE' && Boolean(contentDto.content),
  );

  return (
    <section className="flex h-fit w-full flex-col items-center justify-center border-b border-b-gray-96 bg-white">
      <Spacer variant="32" />

      {orderedContents.map((contentDto, index) => {
        const key = `${contentDto.contentOrder ?? index}-${contentDto.contentType ?? 'UNKNOWN'}`;

        if (contentDto.contentType === 'IMAGE' && contentDto.content) {
          return (
            <ArticleImageBlock
              key={key}
              src={contentDto.content}
              alt="게시글 첨부 이미지"
              loading={index === firstImageIndex ? 'eager' : 'lazy'}
            />
          );
        }

        if (contentDto.contentType === 'TEXT' && contentDto.content) {
          return <TextContent key={key} variant="text" text={contentDto.content} />;
        }

        return null;
      })}

      <Spacer variant="32" />
    </section>
  );
}
