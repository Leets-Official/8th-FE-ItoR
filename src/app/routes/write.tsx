import { createFileRoute } from '@tanstack/react-router';
import { WRITE_BLOG_FORM_ID } from '@/features/write/model/writeBlog';
import WriteBlogPage from '@/pages/write/WriteBlogPage';

export const Route = createFileRoute('/write')({
  component: WriteBlogPage,
  staticData: {
    headerVariant: 'ver3',
    headerFormId: WRITE_BLOG_FORM_ID,
  },
});
