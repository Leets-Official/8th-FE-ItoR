type ArticleImageBlockProps = {
  src: string;
  alt: string;
};

/** @returns 사용자가 본문에 삽입한 이미지를 원본 비율로 표시하는 블록 */
export function ArticleImageBlock({ src, alt }: ArticleImageBlockProps) {
  return (
    <figure className="flex h-fit w-full max-w-[688px] bg-white px-4 py-3">
      <img className="h-auto w-full rounded-[4px] object-contain" src={src} alt={alt} />
    </figure>
  );
}
