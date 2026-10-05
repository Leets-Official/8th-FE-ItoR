/** 회원가입 페이지의 제목 안내 영역입니다. */

import { TextContent } from '@/shared/ui/text/TextContent';
import { Spacer } from '@/shared/ui/spacing/Spacer';

export function RegisterIntroSection() {
  return (
    <section className="flex h-fit w-full flex-col items-center justify-center border-b border-b-gray-96 bg-gray-96">
      <Spacer variant="32" />
      <TextContent variant="24" title="회원가입" />
      <Spacer variant="20" />
    </section>
  );
}
