import { createFileRoute } from '@tanstack/react-router';

import MainPage from '@/pages/main/MainPage';

type MainSearch = {
  loginRequired?: boolean;
};

export const Route = createFileRoute('/')({
  component: MainPage,
  validateSearch: (search: Record<string, unknown>): MainSearch =>
    search.loginRequired === true || search.loginRequired === 'true' ? { loginRequired: true } : {},
  staticData: { headerVariant: 'main' },
});
