import { createRouter } from '@tanstack/react-router';
import { routeTree } from './routeTree.gen';
import type { PageHeaderVariant } from '@/shared/ui/header/PageHeader';

declare module '@tanstack/react-router' {
  interface StaticDataRouteOption {
    headerVariant?: PageHeaderVariant;
    headerFormId?: string;
  }
}

export const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
