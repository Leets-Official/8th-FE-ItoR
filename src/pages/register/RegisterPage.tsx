import { RegisterIntroSection } from '@/features/register/sections/RegisterIntroSection';
import { RegisterMethodSection } from '@/features/register/sections/RegisterMethodSection';

/** @returns 회원가입 UI가 배치될 반응형 콘텐츠 틀 */
export default function RegisterPage() {
  return (
    <section className="flex h-fit w-full flex-col">
      <RegisterIntroSection />
      <RegisterMethodSection />
    </section>
  );
}
