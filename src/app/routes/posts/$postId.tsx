import { createFileRoute } from '@tanstack/react-router';

import DetailPage from '@/pages/detail/DetailPage';

export const Route = createFileRoute('/posts/$postId')({
  component: DetailPage,
  staticData: { headerVariant: 'detail' },
});
