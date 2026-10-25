/** 이메일·카카오 회원가입 페이지의 제목과 입력 안내 영역입니다. */

import { Spacer } from '@/shared/ui/spacing/Spacer';
import { TextContent } from '@/shared/ui/text/TextContent';

/** @returns 회원가입 제목과 사용자 정보 입력 안내를 표시하는 영역 */
export function RegisterFormIntroSection() {
  return (
    <section className="flex h-fit w-full flex-col items-center justify-center border-b border-b-gray-96 bg-gray-96">
      <Spacer variant="32" />
      <TextContent
        variant="24"
        headingLevel={1}
        title="회원가입"
        subtitle="가입을 위해 회원님의 정보를 입력해주세요."
      />
      <Spacer variant="20" />
    </section>
  );
}
