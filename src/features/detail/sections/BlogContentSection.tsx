/** 블로그 상세 페이지의 텍스트와 이미지 본문 블록을 표시하는 영역입니다. */

import { Spacer } from '@/shared/ui/spacing/Spacer';
import { TextContent } from '@/shared/ui/text/TextContent';

import { ArticleImageBlock } from '../components/ArticleImageBlock';
import type { ArticleImage } from '../model/detail';

type BlogContentSectionProps = {
  body: string;
  images: readonly ArticleImage[];
};

export function BlogContentSection({ body, images }: BlogContentSectionProps) {
  return (
    <section className="flex h-fit w-full flex-col items-center justify-center border-b border-b-gray-96 bg-white">
      <Spacer variant="32" />

      <TextContent variant="text" text={body} />
      {images.map(({ id, src, alt }) => (
        <ArticleImageBlock key={id} src={src} alt={alt} />
      ))}

      <Spacer variant="32" />
    </section>
  );
}
/** 블로그 상세 페이지의 텍스트와 이미지 본문 블록을 표시하는 영역입니다. */
