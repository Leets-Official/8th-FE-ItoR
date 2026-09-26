import { createRootRoute } from '@tanstack/react-router';
import MainLayout from '@/app/layout/MainLayout';

export const Route = createRootRoute({
  component: MainLayout,
});
