import { createFileRoute } from '@tanstack/react-router';
import BlogDetailPage from '@/pages/blog_detail/BlogDetailPage';

// TODO 현재 url 경로는 임시이며 추후 확정되면 변경 필요. ex) /닉네임/게시글번호
export const Route = createFileRoute('/detail')({
  component: BlogDetailPage,
  staticData: { headerVariant: 'ver2' },
});
