import defaultProfile from '@/shared/assets/images/profile_64.svg';
import { TextField, TextFieldSet } from '@/shared/ui';
import { cn } from '@/shared/lib/utils';
import type { AuthUser } from '../model/types';

// 회원가입 폼과 같은 닉네임 글자 수 제한 — 수정 페이지에서 지켜야 할 조건을 미리 보여준다
const NICKNAME_MAX_LENGTH = 20;

// 시안의 각 입력 영역은 최대 688px 너비에 좌우 16px·위아래 12px 여백
const SECTION_CLASS = 'w-full max-w-[688px]';

interface AccountInfoProps {
  user: AuthUser;
  className?: string;
}

// 내 프로필 설정 — 가입 정보를 보여주기만 하고, 고치는 건 수정하기 페이지에서 한다
export function AccountInfo({ user, className }: AccountInfoProps) {
  const { email, name, birthDate, nickname, introduction, profileImageUrl, provider } = user;

  return (
    <div className={cn('flex w-full flex-col items-center self-stretch', className)}>
      {/* 배경이 gray96이라 흰 배경인 Blank 대신 py-16으로 위아래 64px 여백을 준다 */}
      <section className="flex w-full flex-col items-center self-stretch border-b border-gray-96 bg-gray-96 py-16">
        <div className={cn(SECTION_CLASS, 'px-4 py-3')}>
          <img
            src={profileImageUrl ?? defaultProfile}
            alt=""
            width={64}
            height={64}
            className="size-16 rounded-full object-cover"
          />
        </div>
        <div className={cn(SECTION_CLASS, 'flex flex-col gap-1 px-4 py-3')}>
          <TextField size={32} aria-label="닉네임" value={nickname} readOnly />
          <p className="px-1.5 text-12 font-light text-gray-78">* {NICKNAME_MAX_LENGTH}글자 이내</p>
        </div>
        <div className={cn(SECTION_CLASS, 'px-4 py-3')}>
          <TextField
            aria-label="한 줄 소개"
            value={introduction ?? ''}
            placeholder="한 줄 소개"
            readOnly
          />
        </div>
      </section>

      <section className="flex w-full flex-col items-center self-stretch bg-white py-8">
        <TextFieldSet className={SECTION_CLASS} label="이메일" value={email} readOnly />
        {/* 소셜 가입 계정은 비밀번호가 없다. 비밀번호는 값을 보여주지 않고 입력 칸 모양만 둔다 */}
        {!provider && (
          <>
            <TextFieldSet
              className={SECTION_CLASS}
              label="비밀번호"
              type="password"
              placeholder="······"
              readOnly
            />
            <TextFieldSet
              className={SECTION_CLASS}
              label="비밀번호 확인"
              type="password"
              placeholder="······"
              readOnly
            />
          </>
        )}
        <TextFieldSet className={SECTION_CLASS} label="이름" value={name} readOnly />
        <TextFieldSet
          className={SECTION_CLASS}
          label="생년월일"
          value={birthDate}
          placeholder="YYYY - MM - DD"
          readOnly
        />
      </section>
    </div>
  );
}
