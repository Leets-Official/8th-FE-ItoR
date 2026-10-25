import { createFileRoute } from '@tanstack/react-router';
import DetailPage from '@/pages/detail/DetailPage';

// TODO(ROUTE): 상세 URL 정책이 확정되면 닉네임과 게시글 ID를 포함한 동적 경로로 변경합니다.
export const Route = createFileRoute('/detail')({
  component: DetailPage,
  staticData: { headerVariant: 'detail' },
});
