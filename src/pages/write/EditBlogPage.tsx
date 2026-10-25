import { useParams } from '@tanstack/react-router';

import { EditBlogEditor } from '@/features/write/components/EditBlogEditor';

/** @returns 기존 블로그 글을 수정하는 편집 페이지 */
export default function EditBlogPage() {
  const { postId } = useParams({ from: '/posts_/$postId/edit' });

  return (
    <section className="flex h-fit w-full flex-col items-center">
      <EditBlogEditor postId={postId} />
    </section>
  );
}
