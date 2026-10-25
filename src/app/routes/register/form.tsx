import { createFileRoute } from '@tanstack/react-router';

import RegisterFormPage from '@/pages/register/form/RegisterFormPage';

export type RegisterMethod = 'email' | 'kakao';

type RegisterFormSearch = {
  method: RegisterMethod;
};

export const Route = createFileRoute('/register/form')({
  validateSearch: (search: Record<string, unknown>): RegisterFormSearch => ({
    method: search.method === 'kakao' ? 'kakao' : 'email',
  }),
  component: RegisterFormPage,
  staticData: { headerVariant: 'register' },
});
