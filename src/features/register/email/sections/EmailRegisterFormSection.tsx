/** 이메일 회원가입 페이지의 사용자 정보 입력과 완료 동작 영역입니다. */

import { AddPhotoAlternateIcon } from '@/shared/assets/icons/icons';
import { Avatar } from '@/shared/ui/avatar/Avatar';
import { ActionButton } from '@/shared/ui/button/ActionButton';
import { PillButton } from '@/shared/ui/button/PillButton';
import { ActionDialog } from '@/shared/ui/dialog/ActionDialog';
import { FormField } from '@/shared/ui/input/FormField';
import { Spacer } from '@/shared/ui/spacing/Spacer';

import { useEmailRegisterForm } from '../hooks/useEmailRegisterForm';

/** @returns 이메일 회원가입 정보를 입력하는 영역 */
export function EmailRegisterFormSection() {
  const {
    values,
    errors,
    hasSubmitted,
    isCompletionDialogOpen,
    updateValue,
    submitRegistration,
    moveToMainPage,
  } = useEmailRegisterForm();

  return (
    <section className="flex h-fit w-full flex-col items-center justify-center bg-white">
      <form
        className="flex h-fit w-full flex-col items-center"
        noValidate
        onSubmit={submitRegistration}
      >
        <Spacer variant="32" />
        {/* 프로필 사진 추가 */}
        <div className="flex h-fit w-full max-w-[688px] flex-col gap-4 px-4 py-3">
          <div className="flex h-fit w-full gap-2.5 px-1.5">
            <span className="text-14-light text-gray-56">프로필 사진</span>
          </div>
          <div className="flex h-fit w-fit flex-col gap-4">
            <Avatar size="large" />

            <ActionButton icon={AddPhotoAlternateIcon} hasBorder={true} text="프로필 사진 추가" />
          </div>
        </div>

        <div className="flex h-fit w-full max-w-[688px] flex-col">
          <FormField
            title="이메일"
            inputType="email"
            textPlaceholder="이메일"
            value={values.email}
            warningMessage="* 반드시 입력해야하는 필수 사항입니다."
            showWarning={hasSubmitted && errors.email}
            onChange={(value) => updateValue('email', value)}
          />
          <FormField
            title="비밀번호"
            inputType="password"
            textPlaceholder="......"
            value={values.password}
            onChange={(value) => updateValue('password', value)}
          />
          <FormField
            title="비밀번호 확인"
            inputType="password"
            textPlaceholder="......"
            value={values.passwordConfirm}
            warningMessage="* 비밀번호가 일치하지 않습니다."
            showWarning={hasSubmitted && errors.passwordConfirm}
            onChange={(value) => updateValue('passwordConfirm', value)}
          />
          <FormField
            title="이름"
            textPlaceholder="이름"
            value={values.name}
            warningMessage="* 반드시 입력해야하는 필수 사항입니다."
            showWarning={hasSubmitted && errors.name}
            onChange={(value) => updateValue('name', value)}
          />
          <FormField
            title="생년월일"
            textPlaceholder="YYYY - MM - DD"
            value={values.birthDate}
            warningMessage="* 2025년 3월 16일 이전의 수만 가능합니다."
            showWarning={hasSubmitted && errors.birthDate}
            onChange={(value) => updateValue('birthDate', value)}
          />
          <FormField
            title="닉네임"
            textPlaceholder="닉네임"
            helperText="* 20글자 이내"
            value={values.nickname}
            warningMessage="* 닉네임은 최대 20글자입니다."
            showWarning={hasSubmitted && errors.nickname}
            onChange={(value) => updateValue('nickname', value)}
          />
          <FormField
            title="한 줄 소개"
            textPlaceholder="한 줄 소개"
            value={values.introduction}
            warningMessage="* 한 줄 소개는 최대 30글자입니다."
            showWarning={hasSubmitted && errors.introduction}
            onChange={(value) => updateValue('introduction', value)}
          />
        </div>

        <Spacer variant="32" />

        <div className="flex h-fit w-full max-w-[688px] gap-2.5 px-4">
          <PillButton type="submit" variant="point" text="회원가입 완료" width="fill" />
        </div>

        <Spacer variant="64" />
      </form>

      {isCompletionDialogOpen ? (
        <ActionDialog
          title="회원가입이 완료되었습니다!"
          cancelLabel="확인"
          confirmLabel="로그인하기"
          confirmVariant="point"
          onCancel={moveToMainPage}
          onConfirm={moveToMainPage}
        />
      ) : null}
    </section>
  );
}
