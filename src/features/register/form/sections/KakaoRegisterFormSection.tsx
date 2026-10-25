/** 회원가입 정보 입력 페이지의 카카오 가입 폼과 완료 동작 영역입니다. */

import type { OAuthRegisterRequiredResponse } from '@/shared/auth/model/auth';
import { PillButton } from '@/shared/ui/button/PillButton';
import { ActionDialog } from '@/shared/ui/dialog/ActionDialog';
import { FormField } from '@/shared/ui/input/FormField';
import { Spacer } from '@/shared/ui/spacing/Spacer';
import { formatBirthDateInput } from '@/shared/utils/date';

import { ProfileImageField } from '../components/ProfileImageField';
import { SocialLoginField } from '../components/SocialLoginField';
import { useKakaoRegisterForm } from '../hooks/useKakaoRegisterForm';

type KakaoRegisterFormSectionProps = {
  registration: OAuthRegisterRequiredResponse | null;
};

/** @returns 카카오 계정 정보와 회원가입 추가 정보 입력 영역 */
export function KakaoRegisterFormSection({ registration }: KakaoRegisterFormSectionProps) {
  const {
    values,
    errors,
    hasSubmitted,
    isCompletionDialogOpen,
    apiErrorMessage,
    isSubmitting,
    updateValue,
    selectProfileImage,
    submitRegistration,
    moveToMainPage,
    startKakaoLogin,
  } = useKakaoRegisterForm(registration);

  return (
    <section className="flex h-fit w-full flex-col items-center justify-center bg-white">
      <form
        className="flex h-fit w-full flex-col items-center"
        noValidate
        onSubmit={submitRegistration}
      >
        <Spacer variant="32" />
        <ProfileImageField
          initialImageUrl={registration?.picture ?? ''}
          onChange={selectProfileImage}
        />

        <div className="flex h-fit w-full max-w-[688px] flex-col">
          <SocialLoginField />
          <FormField
            title="이메일"
            inputType="email"
            textPlaceholder="이메일"
            value={values.email}
            warningMessage="* 이메일 형식이 적합하지 않습니다."
            showWarning={hasSubmitted && errors.email}
            onChange={(value) => updateValue('email', value)}
          />
          <FormField
            title="이름"
            textPlaceholder="이름"
            value={values.name}
            disabled
            warningMessage="* 이름은 20자 이내의 한글로 입력해주세요."
            showWarning={hasSubmitted && errors.name}
          />
          <FormField
            title="생년월일"
            textPlaceholder="YYYY - MM - DD"
            value={values.birthDate}
            warningMessage="* 2025년 3월 16일 이전의 수만 가능합니다."
            showWarning={hasSubmitted && errors.birthDate}
            onChange={(value) => updateValue('birthDate', formatBirthDateInput(value))}
          />
          <FormField
            title="닉네임"
            textPlaceholder="닉네임"
            helperText="* 20글자 이내"
            value={values.nickname}
            warningMessage="* 닉네임은 3자 이상 20자 이하의 영문과 숫자로 입력해주세요."
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

        {apiErrorMessage ? (
          <p role="alert" className="text-12-light w-full max-w-[688px] px-[22px] text-negative">
            {apiErrorMessage}
          </p>
        ) : null}

        <div className="flex h-fit w-full max-w-[688px] gap-2.5 px-4">
          <PillButton
            type="submit"
            variant="point"
            text={isSubmitting ? '회원가입 중...' : '회원가입 완료'}
            width="fill"
            disabled={isSubmitting}
          />
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
          onConfirm={startKakaoLogin}
        />
      ) : null}
    </section>
  );
}
