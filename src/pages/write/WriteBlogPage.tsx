import { WriteBlogEditor } from '@/features/write/components/WriteBlogEditor';

/** @returns 블로그 글 작성 UI가 배치될 반응형 콘텐츠 틀 */
export default function WriteBlogPage() {
  return (
    <section className="flex h-fit w-full flex-col items-center">
      <WriteBlogEditor />
    </section>
  );
}
