import type { MouseEvent } from 'react';

import type { ArticleImage } from '../model/article';
import { ImageBlockMenu } from './ImageBlockMenu';

type ArticleImageBlockProps = {
  image: ArticleImage;
  isSelected: boolean;
  onSelect: (imageId: string) => void;
  onRemove: (imageId: string) => void;
};

/** @returns 선택 여부에 따라 테두리와 삭제 메뉴를 표시하는 본문 이미지 */
export function ArticleImageBlock({
  image,
  isSelected,
  onSelect,
  onRemove,
}: ArticleImageBlockProps) {
  function handleRemove(event: MouseEvent<HTMLButtonElement>) {
    event.stopPropagation();
    onRemove(image.id);
  }

  return (
    <figure
      data-article-image
      className={`relative flex h-fit w-full max-w-[688px] border bg-white px-4 py-3 ${
        isSelected ? 'border-point' : 'border-gray-90'
      }`}
    >
      {isSelected ? (
        <button
          type="button"
          aria-label="본문 이미지 삭제"
          className="absolute bottom-full left-1/2 mb-1.5 -translate-x-1/2"
          onClick={handleRemove}
        >
          <ImageBlockMenu />
        </button>
      ) : null}

      <button
        type="button"
        aria-label="본문 이미지 선택"
        className="block h-fit w-full rounded-[4px]"
        onClick={() => onSelect(image.id)}
      >
        <img
          className="h-auto w-full rounded-[4px] object-contain"
          src={image.src}
          alt={image.alt}
        />
      </button>
    </figure>
  );
}
