import { Outlet, createFileRoute } from '@tanstack/react-router';

import { requireAuth } from '@/app/guards/requireAuth';

export const Route = createFileRoute('/my')({
  beforeLoad: requireAuth,
  component: Outlet,
});
