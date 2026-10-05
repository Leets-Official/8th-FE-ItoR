import { createRouter } from '@tanstack/react-router';

import type { AppHeaderVariant } from '@/app/layout/model/header';

import { routeTree } from './routeTree.gen';

declare module '@tanstack/react-router' {
  interface StaticDataRouteOption {
    headerVariant?: AppHeaderVariant;
    headerFormId?: string;
  }
}

export const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
