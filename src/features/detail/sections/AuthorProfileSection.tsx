/** 블로그 상세 페이지의 작성자 프로필과 한 줄 소개 영역입니다. */

import { Spacer } from '@/shared/ui/spacing/Spacer';
import { Avatar } from '@/shared/ui/avatar/Avatar';
import { TextContent } from '@/shared/ui/text/TextContent';

type AuthorProfileSectionProps = {
  nickName: string;
  introduction: string;
  profileUrl?: string;
};

export function AuthorProfileSection({
  nickName,
  introduction,
  profileUrl,
}: AuthorProfileSectionProps) {
  return (
    <section className="flex h-[354px] w-full flex-col items-center justify-center border-b border-b-gray-96 bg-gray-96">
      <Spacer variant="64" />

      <div className="flex h-fit w-full max-w-[688px] gap-2.5 px-4 py-3">
        <Avatar size="medium" src={profileUrl} />
      </div>

      <TextContent variant="24" title={nickName} subtitle={introduction} />

      <Spacer variant="64" />
    </section>
  );
}
