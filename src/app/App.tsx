import { RouterProvider } from 'react-router/dom';
import { AuthProvider } from '@/features/auth';
import { Toaster } from '@/shared/ui';
import { router } from './router';

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
      <Toaster />
    </AuthProvider>
  );
}

export default App;
