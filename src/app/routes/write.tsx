import { createFileRoute } from '@tanstack/react-router';

import { requireAuth } from '@/app/guards/requireAuth';
import { WRITE_BLOG_FORM_ID } from '@/features/write/model/writeBlog';
import WriteBlogPage from '@/pages/write/WriteBlogPage';

export const Route = createFileRoute('/write')({
  beforeLoad: requireAuth,
  component: WriteBlogPage,
  staticData: {
    headerVariant: 'write',
    headerFormId: WRITE_BLOG_FORM_ID,
  },
});
