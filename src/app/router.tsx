import { createBrowserRouter } from 'react-router';
import { BlogDetailPage } from '@/pages/BlogDetailPage';
import { BlogSearchPage } from '@/pages/BlogSearchPage';
import { SignUpPage } from '@/pages/SignUpPage';
import { RootLayout } from './RootLayout';

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: '/', element: <BlogSearchPage /> },
      { path: '/posts/:postId', element: <BlogDetailPage /> },
      { path: '/signup', element: <SignUpPage /> },
    ],
  },
]);
