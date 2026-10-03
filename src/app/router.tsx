import { createBrowserRouter } from 'react-router';
import { BlogDetailPage } from '@/pages/BlogDetailPage';
import { BlogSearchPage } from '@/pages/BlogSearchPage';

export const router = createBrowserRouter([
  { path: '/', element: <BlogSearchPage /> },
  { path: '/posts/:postId', element: <BlogDetailPage /> },
]);
