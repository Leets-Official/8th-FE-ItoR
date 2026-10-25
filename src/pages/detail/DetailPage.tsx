import { useParams } from '@tanstack/react-router';

import { PostDetailContent } from '@/features/detail/components/PostDetailContent';

/** @returns 블로그 상세 페이지 UI */
export default function DetailPage() {
  const { postId } = useParams({ from: '/posts/$postId' });

  return (
    <section className="flex h-fit w-full flex-col items-center justify-center">
      <PostDetailContent postId={postId} />
    </section>
  );
}
