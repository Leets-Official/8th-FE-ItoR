type ArticleImageBlockProps = {
  src: string;
  alt: string;
  loading?: 'eager' | 'lazy';
};

/** @returns 사용자가 본문에 삽입한 이미지를 원본 비율로 표시하는 블록 */
export function ArticleImageBlock({ src, alt, loading = 'lazy' }: ArticleImageBlockProps) {
  return (
    <figure className="flex h-fit w-full max-w-[688px] bg-white px-4 py-3">
      <img
        className="h-auto w-full rounded-[4px] object-contain"
        src={toSecureImageUrl(src)}
        alt={alt}
        loading={loading}
        decoding="async"
        fetchPriority={loading === 'eager' ? 'high' : 'auto'}
      />
    </figure>
  );
}
import { toSecureImageUrl } from '@/shared/utils/image';
