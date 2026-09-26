import { CustomBlank } from '@/shared/ui/blank/CustomBlank';
import { Profile_64 } from '@/shared/ui/profile/CustomProfile';
import { CustomTextBox } from '@/shared/ui/text/text_box/CustomTextBox';

/** @returns 작성자의 프로필 이미지, 닉네임과 한 줄 소개를 표시하는 영역 */
export function ProfileSection() {
  return (
    <section className="flex h-[354px] w-full flex-col items-center justify-center border-b border-b-gray-96 bg-gray-96">
      <CustomBlank variant="64" />

      <div className="flex h-fit w-full max-w-[688px] gap-2.5 px-4 py-3">
        <Profile_64 />
      </div>

      <CustomTextBox variant="24" title="%{닉네임}" subtitle="%{한 줄 소개}" />

      <CustomBlank variant="64" />
    </section>
  );
}
