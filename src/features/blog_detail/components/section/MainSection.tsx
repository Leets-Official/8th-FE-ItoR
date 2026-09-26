import { CustomBlank } from '@/shared/ui/blank/CustomBlank';
import { CustomTextBox } from '@/shared/ui/text/text_box/CustomTextBox';

import { ImageBlock, type ImageBlockProps } from '../ImageBlock';

type MainSectionProps = {
  images?: ImageBlockProps[];
};

/** @returns 블로그 글의 텍스트와 이미지 본문을 표시하는 영역 */
export function MainSection({ images = [] }: MainSectionProps) {
  return (
    <section className="flex h-fit w-full flex-col items-center justify-center border-b border-b-gray-96 bg-white">
      <CustomBlank variant="32" />

      <CustomTextBox variant="text" text="어쩌구 저쩌구" />
      {images.map(({ src, alt }) => (
        <ImageBlock key={src} src={src} alt={alt} />
      ))}

      <CustomBlank variant="32" />
    </section>
  );
}
