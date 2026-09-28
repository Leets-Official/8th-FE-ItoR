import { MessageCircle } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import Button from '@/components/common/Button';
import ConfirmModal from '@/components/common/ConfirmModal';
import TextField from '@/components/common/TextField';
import Header from '@/components/layout/Header';
import PageBanner from '@/components/layout/PageBanner';
import ProfileImageInput from '@/components/profile/ProfileImageInput';
import { ROUTES } from '@/constants/routes';
import { NICKNAME_MAX_LENGTH } from '@/constants/validation';
import { useImagePreview } from '@/hooks/useImagePreview';
import { useLoginModal } from '@/hooks/useLoginModal';
import { useProfileForm } from '@/hooks/useProfileForm';
import { hasErrors, validateProfileForm } from '@/utils/validateProfileForm';

const EMPTY_VALUES = {
  email: '',
  password: '',
  passwordConfirm: '',
  name: '',
  birthDate: '',
  nickname: '',
  introduction: '',
};

function SignupFormPage() {
  const [searchParams] = useSearchParams();
  const isKakaoSignup = searchParams.get('provider') === 'kakao';
  const { values, setErrors, getFieldProps } = useProfileForm(EMPTY_VALUES);
  const { previewUrl, selectImage } = useImagePreview();
  const { openLoginModal } = useLoginModal();
  const navigate = useNavigate();
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const errors = validateProfileForm(values, { requiresPassword: !isKakaoSignup });
    setErrors(errors);
    if (hasErrors(errors)) return;
    // 3주차: 프로필 이미지는 Pre-Signed URL로 올리고, 회원가입 API를 호출한다.
    setIsCompleteModalOpen(true);
  };

  return (
    <>
      <Header />
      <main>
        <PageBanner>
          <h1 className="text-xl font-medium text-ink">회원가입</h1>
          <p className="mt-2 text-xs text-gray-500">가입을 위해 회원님의 정보를 입력해주세요.</p>
        </PageBanner>

        <form
          noValidate
          onSubmit={handleSubmit}
          className="mx-auto flex max-w-[480px] flex-col gap-6 px-4 py-10"
        >
          <div className="flex flex-col gap-2">
            <span className="px-1 text-sm text-gray-500">프로필 사진</span>
            <ProfileImageInput previewUrl={previewUrl} onSelectImage={selectImage} showAddButton />
          </div>

          {isKakaoSignup && (
            <TextField
              label="소셜 로그인"
              value="카카오 로그인"
              leftIcon={<MessageCircle size={16} fill="currentColor" aria-hidden />}
              disabled
              readOnly
            />
          )}
          <TextField
            label="이메일"
            type="email"
            autoComplete="email"
            placeholder="이메일"
            {...getFieldProps('email')}
          />
          {!isKakaoSignup && (
            <>
              <TextField
                label="비밀번호"
                type="password"
                autoComplete="new-password"
                placeholder="········"
                {...getFieldProps('password')}
              />
              <TextField
                label="비밀번호 확인"
                type="password"
                autoComplete="new-password"
                placeholder="········"
                {...getFieldProps('passwordConfirm')}
              />
            </>
          )}
          <TextField
            label="이름"
            autoComplete="name"
            placeholder="이름"
            {...getFieldProps('name')}
          />
          <TextField
            label="생년월일"
            inputMode="numeric"
            placeholder="YYYY-MM-DD"
            {...getFieldProps('birthDate')}
          />
          <TextField
            label="닉네임"
            placeholder="닉네임"
            helperText={`${NICKNAME_MAX_LENGTH}글자 이내`}
            maxLength={NICKNAME_MAX_LENGTH}
            {...getFieldProps('nickname')}
          />
          <TextField
            label="한 줄 소개"
            placeholder="한 줄 소개"
            {...getFieldProps('introduction')}
          />

          <Button type="submit" variant="outline-point" size="md" fullWidth className="mt-4">
            회원가입 완료
          </Button>
        </form>
      </main>

      {isCompleteModalOpen && (
        <ConfirmModal
          title="회원가입이 완료되었습니다!"
          cancelLabel="확인"
          confirmLabel="로그인하기"
          confirmTone="point"
          onCancel={() => navigate(ROUTES.HOME)}
          onConfirm={() => {
            navigate(ROUTES.HOME);
            openLoginModal();
          }}
        />
      )}
    </>
  );
}

export default SignupFormPage;
