import { createFileRoute } from '@tanstack/react-router';

import MyPage from '@/pages/my/MyPage';

export const Route = createFileRoute('/my/')({
  component: MyPage,
  staticData: { headerVariant: 'main' },
});
