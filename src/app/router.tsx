import { createBrowserRouter } from 'react-router';
import { BlogDetailPage } from '@/pages/BlogDetailPage';
import { BlogSearchPage } from '@/pages/BlogSearchPage';
import { SignUpPage } from '@/pages/SignUpPage';

export const router = createBrowserRouter([
  { path: '/', element: <BlogSearchPage /> },
  { path: '/posts/:postId', element: <BlogDetailPage /> },
  { path: '/signup', element: <SignUpPage /> },
]);
