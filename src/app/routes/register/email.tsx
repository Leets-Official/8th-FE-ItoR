import { createFileRoute } from '@tanstack/react-router';

import EmailRegisterPage from '@/pages/register/email/EmailRegisterPage';

export const Route = createFileRoute('/register/email')({
  component: EmailRegisterPage,
  staticData: { headerVariant: 'register' },
});
