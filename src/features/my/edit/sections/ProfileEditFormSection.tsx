/** 프로필 수정 페이지의 프로필과 회원 정보 입력 영역입니다. */

import { Spacer } from '@/shared/ui/spacing/Spacer';
import { FormField } from '@/shared/ui/input/FormField';
import { formatBirthDateInput } from '@/shared/utils/date';
import { ProfileImageEditor } from '../components/ProfileImageEditor';
import { useProfileEditForm } from '../hooks/useProfileEditForm';
import { PROFILE_EDIT_FORM_ID } from '../model/profileEdit';

export function ProfileEditFormSection() {
  const {
    isEditing,
    values,
    profilePicture,
    errors,
    hasSubmitted,
    isLoading,
    isSubmitting,
    apiErrorMessage,
    updateValue,
    selectProfileImage,
    submitProfile,
    resetProfile,
  } = useProfileEditForm();

  return (
    <form
      id={PROFILE_EDIT_FORM_ID}
      className="flex h-fit w-full flex-col"
      aria-busy={isLoading || isSubmitting}
      onSubmit={submitProfile}
      onReset={resetProfile}
    >
      <section className="flex h-fit w-full flex-col items-center justify-center border-b border-gray-96 bg-gray-96">
        <Spacer variant="64" />
        <div className="flex h-fit w-full max-w-[688px] px-4 py-3">
          <ProfileImageEditor
            src={profilePicture || undefined}
            isEditing={isEditing}
            onChange={selectProfileImage}
          />
        </div>

        <div className="flex h-fit w-full max-w-[688px] flex-col">
          <FormField
            variant="24"
            textPlaceholder="닉네임"
            helperText="* 20글자 이내"
            warningMessage="* 닉네임은 3~20자의 영문과 숫자로 작성해주세요."
            showWarning={isEditing && hasSubmitted && errors.nickname}
            value={isEditing ? values.nickname : ''}
            readOnly={!isEditing}
            onChange={(value) => updateValue('nickname', value)}
          />
          <FormField
            variant="14"
            textPlaceholder="한 줄 소개"
            warningMessage="* 한 줄 소개는 최대 30글자입니다."
            showWarning={isEditing && hasSubmitted && errors.introduction}
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
          showWarning={isEditing && hasSubmitted && errors.email}
        />
        <FormField
          title="비밀번호"
          inputType="password"
          textPlaceholder="......"
          value={isEditing ? values.password : ''}
          readOnly={!isEditing}
          warningMessage="* 8~64자의 영문, 숫자, 특수문자를 입력해주세요."
          showWarning={isEditing && hasSubmitted && errors.password}
          onChange={(value) => updateValue('password', value)}
        />
        <FormField
          title="비밀번호 확인"
          inputType="password"
          textPlaceholder="......"
          value={isEditing ? values.passwordConfirm : ''}
          readOnly={!isEditing}
          warningMessage="* 비밀번호가 일치하지 않습니다."
          showWarning={isEditing && hasSubmitted && errors.passwordConfirm}
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
          warningMessage="* 생년월일을 YYYY-MM-DD 형식으로 입력해주세요."
          showWarning={isEditing && hasSubmitted && errors.birthDate}
          onChange={(value) => updateValue('birthDate', formatBirthDateInput(value))}
        />

        {apiErrorMessage ? (
          <p role="alert" className="text-12-light w-full max-w-[688px] px-[22px] text-negative">
            {apiErrorMessage}
          </p>
        ) : null}

        <Spacer variant="32" />
      </section>
    </form>
  );
}
