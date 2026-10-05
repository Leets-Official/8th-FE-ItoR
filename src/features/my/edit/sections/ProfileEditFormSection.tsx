/** 프로필 수정 페이지의 프로필과 회원 정보 입력 영역입니다. */

import { Spacer } from '@/shared/ui/spacing/Spacer';
import { Avatar } from '@/shared/ui/avatar/Avatar';
import { FormField } from '@/shared/ui/input/FormField';
import { useProfileEditForm } from '../hooks/useProfileEditForm';
import { PROFILE_EDIT_FORM_ID } from '../model/profileEdit';
import type { MyProfile } from '../../model/my';

type ProfileEditFormSectionProps = {
  initialProfile: MyProfile;
};

export function ProfileEditFormSection({ initialProfile }: ProfileEditFormSectionProps) {
  const { isEditing, values, errors, updateValue, submitProfile, resetProfile } =
    useProfileEditForm(initialProfile);

  return (
    <form
      id={PROFILE_EDIT_FORM_ID}
      className="flex h-fit w-full flex-col"
      onSubmit={submitProfile}
      onReset={resetProfile}
    >
      <section className="flex h-fit w-full flex-col items-center justify-center border-b border-gray-96 bg-gray-96">
        <Spacer variant="64" />
        <div className="flex h-fit w-full max-w-[688px] px-4 py-3">
          <Avatar size="medium" />
        </div>

        <div className="flex h-fit w-full max-w-[688px] flex-col">
          <FormField
            variant="24"
            textPlaceholder="닉네임"
            helperText="* 20글자 이내"
            warningMessage="* 20글자 이내로 작성해주세요"
            showWarning={isEditing && errors.nickname}
            value={isEditing ? values.nickname : ''}
            readOnly={!isEditing}
            onChange={(value) => updateValue('nickname', value)}
          />
          <FormField
            variant="14"
            textPlaceholder="한 줄 소개"
            value={isEditing ? values.introduction : ''}
            readOnly={!isEditing}
            onChange={(value) => updateValue('introduction', value)}
          />
        </div>
        <Spacer variant="20" />
      </section>

      <section className="flex h-fit w-full flex-col items-center border-b bg-white">
        <Spacer variant="32" />

        <FormField
          title="메일"
          inputType="email"
          textPlaceholder="ahksjhd@gmail.com"
          value={isEditing ? values.email : ''}
          disabled={isEditing}
          readOnly={!isEditing}
          warningMessage="이메일 형식이 적합하지 않습니다"
          showWarning={isEditing && errors.email}
        />
        <FormField
          title="비밀번호"
          inputType="password"
          textPlaceholder="......"
          value={isEditing ? values.password : ''}
          readOnly={!isEditing}
          onChange={(value) => updateValue('password', value)}
        />
        <FormField
          title="비밀번호 확인"
          inputType="password"
          textPlaceholder="......"
          value={isEditing ? values.passwordConfirm : ''}
          readOnly={!isEditing}
          warningMessage="* 비밀번호가 일치하지 않습니다."
          showWarning={isEditing && errors.passwordConfirm}
          onChange={(value) => updateValue('passwordConfirm', value)}
        />
        <FormField
          title="이름"
          textPlaceholder="김릿츠"
          value={isEditing ? values.name : ''}
          disabled={isEditing}
          readOnly={!isEditing}
        />
        <FormField
          title="생년월일"
          textPlaceholder="YYYY - MM - DD"
          value={isEditing ? values.birthDate : ''}
          readOnly={!isEditing}
          onChange={(value) => updateValue('birthDate', value)}
        />

        <Spacer variant="32" />
      </section>
    </form>
  );
}
