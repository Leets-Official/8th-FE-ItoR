import { useSearch } from '@tanstack/react-router';

import { RegisterFormSection } from '@/features/register/form/sections/RegisterFormSection';
import { RegisterFormIntroSection } from '@/features/register/sections/RegisterFormIntroSection';

export default function RegisterFormPage() {
  const { method } = useSearch({ from: '/register/form' });

  return (
    <section className="flex h-fit w-full flex-col items-center justify-center">
      <RegisterFormIntroSection />
      <RegisterFormSection method={method} />
    </section>
  );
}
