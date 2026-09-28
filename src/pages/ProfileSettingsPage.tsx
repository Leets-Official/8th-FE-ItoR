import { MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router';
import Button from '@/components/common/Button';
import TextField from '@/components/common/TextField';
import Header from '@/components/layout/Header';
import PageBanner from '@/components/layout/PageBanner';
import ProfileImageInput from '@/components/profile/ProfileImageInput';
import { NICKNAME_MAX_LENGTH } from '@/constants/validation';
import { useAuth } from '@/hooks/useAuth';
import { useImagePreview } from '@/hooks/useImagePreview';
import { useProfileForm } from '@/hooks/useProfileForm';
import { useToast } from '@/hooks/useToast';
import type { User } from '@/types/user';
import { hasErrors, validateProfileForm } from '@/utils/validateProfileForm';

function ProfileSettingsForm({ user }: { user: User }) {
  const { updateUser } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const isKakaoUser = user.provider === 'KAKAO';
  const { previewUrl, selectImage } = useImagePreview(user.profileImageUrl);
  const { values, setErrors, getFieldProps } = useProfileForm({
    email: user.email,
    password: '',
    passwordConfirm: '',
    name: user.name,
    birthDate: user.birthDate,
    nickname: user.nickname,
    introduction: user.introduction,
  });

  const saveProfile = () => {
    const errors = validateProfileForm(values, {
      requiresPassword: !isKakaoUser,
      isPasswordOptional: true,
    });
    setErrors(errors);
    if (hasErrors(errors)) {
      showToast('error', '입력한 내용을 확인해주세요');
      return;
    }
    // 3주차: 사용자 정보 수정 API를 호출한다.
    updateUser({
      nickname: values.nickname,
      introduction: values.introduction,
      birthDate: values.birthDate,
      profileImageUrl: previewUrl,
    });
    showToast('success', '저장되었습니다!');
  };

  return (
    <>
      <Header
        actions={
          <>
            <Button variant="text-danger" onClick={() => navigate(-1)}>
              취소하기
            </Button>
            <Button variant="text-strong" onClick={saveProfile}>
              저장하기
            </Button>
          </>
        }
      />
      <main>
        <h1 className="sr-only">계정 설정</h1>
        <PageBanner>
          <div className="flex flex-col gap-4">
            <ProfileImageInput previewUrl={previewUrl} onSelectImage={selectImage} />
            <TextField
              aria-label="닉네임"
              size="lg"
              placeholder="닉네임"
              helperText={`${NICKNAME_MAX_LENGTH}글자 이내`}
              maxLength={NICKNAME_MAX_LENGTH}
              {...getFieldProps('nickname')}
            />
            <TextField
              aria-label="한 줄 소개"
              placeholder="한 줄 소개"
              {...getFieldProps('introduction')}
            />
          </div>
        </PageBanner>

        <form
          noValidate
          onSubmit={(event) => {
            event.preventDefault();
            saveProfile();
          }}
          className="mx-auto flex max-w-[680px] flex-col gap-6 px-4 py-10"
        >
          {isKakaoUser && (
            <TextField
              label="소셜 로그인"
              value="카카오 로그인"
              leftIcon={<MessageCircle size={16} fill="currentColor" aria-hidden />}
              disabled
              readOnly
            />
          )}
          <TextField label="이메일" type="email" disabled {...getFieldProps('email')} />
          {!isKakaoUser && (
            <>
              <TextField
                label="비밀번호"
                type="password"
                autoComplete="new-password"
                placeholder="변경할 때만 입력하세요"
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
          <TextField label="이름" disabled {...getFieldProps('name')} />
          <TextField
            label="생년월일"
            inputMode="numeric"
            placeholder="YYYY-MM-DD"
            {...getFieldProps('birthDate')}
          />
          {/* Enter 키로도 저장할 수 있도록 숨긴 제출 버튼 */}
          <button type="submit" className="sr-only" tabIndex={-1}>
            저장하기
          </button>
        </form>
      </main>
    </>
  );
}

/** 로그인한 사용자 정보로 폼 초기값을 채우기 위해, user가 있을 때만 폼을 그린다. */
function ProfileSettingsPage() {
  const { user } = useAuth();
  return user ? <ProfileSettingsForm user={user} /> : null;
}

export default ProfileSettingsPage;
