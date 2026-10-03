import { RouterProvider } from 'react-router/dom';
import { Toaster } from '@/shared/ui';
import { router } from './router';

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster />
    </>
  );
}

export default App;
