import { MY_PROFILE_MOCK } from '@/features/my/mocks/profile.mock';
import { ProfileEditFormSection } from '@/features/my/edit/sections/ProfileEditFormSection';

/** @returns 프로필 수정 기능을 조립한 페이지 */
export default function MyEditPage() {
  return (
    <section className="flex h-fit w-full flex-col">
      <ProfileEditFormSection initialProfile={MY_PROFILE_MOCK} />
    </section>
  );
}
