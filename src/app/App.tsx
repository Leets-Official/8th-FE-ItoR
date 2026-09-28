import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { BlogDetailPage } from '@/pages/BlogDetailPage';
import { BlogSearchPage } from '@/pages/BlogSearchPage';
import { Toaster } from '@/shared/ui';

const router = createBrowserRouter([
  { path: '/', element: <BlogSearchPage /> },
  { path: '/posts/:postId', element: <BlogDetailPage /> },
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster />
    </>
  );
}

export default App;
