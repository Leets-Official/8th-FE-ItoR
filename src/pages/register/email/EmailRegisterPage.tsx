import { EmailRegisterFormSection } from '@/features/register/email/sections/EmailRegisterFormSection';
import { EmailRegisterIntroSection } from '@/features/register/email/sections/EmailRegisterIntroSection';

export default function EmailRegisterPage() {
  return (
    <section className="flex h-fit w-full flex-col items-center justify-center">
      <EmailRegisterIntroSection />
      <EmailRegisterFormSection />
    </section>
  );
}
