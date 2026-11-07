import { createFileRoute } from '@tanstack/react-router';

import { requireAuth } from '@/app/guards/requireAuth';
import { WRITE_BLOG_FORM_ID } from '@/features/write/model/writeBlog';
import EditBlogPage from '@/pages/write/EditBlogPage';

export const Route = createFileRoute('/posts_/$postId/edit')({
  beforeLoad: requireAuth,
  component: EditBlogPage,
  staticData: {
    headerVariant: 'write',
    headerFormId: WRITE_BLOG_FORM_ID,
  },
});
