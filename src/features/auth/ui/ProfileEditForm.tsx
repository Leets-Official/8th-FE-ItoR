import { useRef, useState, type ChangeEvent, type Ref, type SubmitEvent } from 'react';
import defaultProfile from '@/shared/assets/images/profile_64.svg';
import { Icon, showToast, TextField, TextFieldSet } from '@/shared/ui';
import { uploadImage } from '@/shared/api/uploadImage';
import { cn } from '@/shared/lib/utils';
import {
  EMAIL_PATTERN,
  formatBirthDate,
  NICKNAME_MAX_LENGTH,
  PASSWORD_PATTERN,
  PROFILE_ERROR_MESSAGE,
  SOCIAL_PROVIDER_LABEL,
  validateProfile,
  type ProfileField,
} from '../lib/profileFields';
import type { AuthUser } from '../model/types';
import { useAuth } from '../model/useAuth';

type ProfileEditField = ProfileField | 'email' | 'password' | 'passwordConfirm';
type ProfileEditFieldErrors = Partial<Record<ProfileEditField, string>>;

// 화면에 놓인 순서. 문구가 붙은 첫 칸으로 포커스를 옮길 때 이 순서를 따른다
const PROFILE_EDIT_FIELDS: ProfileEditField[] = [
  'nickname',
  'introduction',
  'email',
  'password',
  'passwordConfirm',
  'name',
  'birthDate',
];

// AccountInfo와 같은 배치 — 최대 688px 너비에 좌우 16px·위아래 12px 여백
const SECTION_CLASS = 'w-full max-w-[688px]';

interface ProfileEditFormProps {
  user: AuthUser;
  // 저장하기 버튼이 폼 바깥(헤더)에 있어서, 페이지가 이 ref로 requestSubmit()을 호출해 제출한다
  ref?: Ref<HTMLFormElement>;
  onSuccess?: () => void;
  className?: string;
}

// 내 프로필 설정의 수정 모드 — AccountInfo와 같은 자리에서 가입 방식을 뺀 모든 항목을 고친다
export function ProfileEditForm({ user, ref, onSuccess, className }: ProfileEditFormProps) {
  const { updateProfile } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [profileImageUrl, setProfileImageUrl] = useState(user.profileImageUrl);
  const [birthDate, setBirthDate] = useState(user.birthDate);
  const [errors, setErrors] = useState<ProfileEditFieldErrors>({});
  const { provider } = user;

  async function handleProfileImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    // 같은 파일을 다시 골라도 change 이벤트가 발생하도록 비운다
    event.target.value = '';
    if (!file) return;

    try {
      setProfileImageUrl(await uploadImage(file));
    } catch {
      showToast('negative', '프로필 사진을 올리지 못했습니다.');
    }
  }

  // 다시 입력하기 시작한 칸의 문구는 지운다. 비밀번호를 고치면 확인 칸의 불일치 문구도 지운다
  function handleFormChange(event: ChangeEvent<HTMLFormElement>) {
    // change 이벤트는 입력창에서 버블링되어 올라오므로 target이 입력창이다
    const { name } = event.target as unknown as HTMLInputElement;
    const fields = (
      name === 'password' ? ['password', 'passwordConfirm'] : [name]
    ) as ProfileEditField[];
    setErrors((prev) => {
      if (!fields.some((field) => field in prev)) return prev;
      const next = { ...prev };
      fields.forEach((field) => delete next[field]);
      return next;
    });
  }

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const read = (name: string) => String(formData.get(name) ?? '').trim();

    const email = read('email');
    const values = {
      name: read('name'),
      birthDate,
      nickname: read('nickname'),
      introduction: read('introduction'),
    };
    const password = String(formData.get('password') ?? '');
    const passwordConfirm = String(formData.get('passwordConfirm') ?? '');

    const nextErrors: ProfileEditFieldErrors = validateProfile(values);
    if (!email) nextErrors.email = PROFILE_ERROR_MESSAGE.required;
    else if (!EMAIL_PATTERN.test(email)) nextErrors.email = PROFILE_ERROR_MESSAGE.invalidEmail;
    // 비밀번호 칸은 비워 두면 바꾸지 않는다
    if (password && !PASSWORD_PATTERN.test(password)) {
      nextErrors.password = PROFILE_ERROR_MESSAGE.invalidPassword;
    } else if (password !== passwordConfirm) {
      nextErrors.passwordConfirm = PROFILE_ERROR_MESSAGE.passwordMismatch;
    }
    if (Object.keys(nextErrors).length === 0) {
      const failure = await updateProfile({
        ...values,
        email,
        introduction: values.introduction || undefined,
        profileImageUrl,
        password: password || undefined,
      });
      if (failure?.error === 'duplicate-email') {
        nextErrors.email = PROFILE_ERROR_MESSAGE.duplicateEmail;
      } else if (failure) {
        showToast('negative', failure.message ?? '저장에 실패했습니다. 잠시 후 다시 시도해주세요.');
        return;
      }
    }

    setErrors(nextErrors);
    // 문구가 붙은 첫 칸으로 키패드를 다시 띄워 바로 고칠 수 있게 한다
    const firstInvalid = PROFILE_EDIT_FIELDS.find((field) => nextErrors[field]);
    if (firstInvalid) {
      form.querySelector<HTMLInputElement>(`[name="${firstInvalid}"]`)?.focus();
      return;
    }

    showToast('positive', '저장되었습니다!');
    onSuccess?.();
  }

  return (
    // 브라우저 기본 검증 말풍선 대신 시안의 문구로 보여주기 위해 직접 검증한다
    <form
      ref={ref}
      noValidate
      className={cn('flex w-full flex-col items-center self-stretch', className)}
      onChange={handleFormChange}
      onSubmit={handleSubmit}
    >
      {/* 배경이 gray96이라 흰 배경인 Blank 대신 py-16으로 위아래 64px 여백을 준다 */}
      <section className="flex w-full flex-col items-center self-stretch border-b border-gray-96 bg-gray-96 py-16">
        <div className={cn(SECTION_CLASS, 'px-4 py-3')}>
          {/* 시안: 프로필 사진 오른쪽 아래의 + 배지로 사진을 바꾼다. 사진 전체를 눌러도 열리게 버튼으로 감싼다 */}
          <button
            type="button"
            aria-label="프로필 사진 변경"
            className="relative block size-16 cursor-pointer rounded-full"
            onClick={() => fileInputRef.current?.click()}
          >
            <img
              src={profileImageUrl ?? defaultProfile}
              alt=""
              width={64}
              height={64}
              className="size-16 rounded-full object-cover"
            />
            <span className="absolute right-0 bottom-0 flex size-4 items-center justify-center rounded-full border border-white bg-gray-20 text-white">
              <Icon name="add" size={12} />
            </span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            hidden
            onChange={handleProfileImageChange}
          />
        </div>
        <div className={cn(SECTION_CLASS, 'flex flex-col gap-1 px-4 py-3')}>
          <TextField
            size={32}
            aria-label="닉네임"
            name="nickname"
            defaultValue={user.nickname}
            placeholder="닉네임"
            autoComplete="nickname"
            aria-invalid={errors.nickname ? true : undefined}
          />
          <p
            className={cn(
              'px-1.5 text-12 font-light',
              errors.nickname ? 'text-negative' : 'text-gray-78',
            )}
          >
            {errors.nickname ?? `* ${NICKNAME_MAX_LENGTH}글자 이내`}
          </p>
        </div>
        <div className={cn(SECTION_CLASS, 'flex flex-col gap-1 px-4 py-3')}>
          <TextField
            aria-label="한 줄 소개"
            name="introduction"
            defaultValue={user.introduction ?? ''}
            placeholder="한 줄 소개"
            aria-invalid={errors.introduction ? true : undefined}
          />
          {errors.introduction && (
            <p className="px-1.5 text-12 font-light text-negative">{errors.introduction}</p>
          )}
        </div>
      </section>

      <section className="flex w-full flex-col items-center self-stretch bg-white py-8">
        {provider && (
          <div className={cn(SECTION_CLASS, 'flex flex-col gap-3 px-4 py-3')}>
            <p className="px-1.5 text-14 font-light text-gray-56">소셜 로그인</p>
            {/* 가입에 쓴 소셜 계정을 보여주기만 하고 바꿀 수는 없다 */}
            <div className="flex items-center gap-2.5 self-stretch rounded-sm bg-gray-90 px-4 py-3 text-14 font-light text-gray-56">
              <Icon name="kakao" size={24} className="text-gray-7" />
              {SOCIAL_PROVIDER_LABEL[provider]}
            </div>
          </div>
        )}
        <TextFieldSet
          className={SECTION_CLASS}
          label="이메일"
          type="email"
          name="email"
          defaultValue={user.email}
          error={errors.email}
          placeholder="이메일"
          autoComplete="email"
        />
        {/* 소셜 가입 계정은 비밀번호가 없다 */}
        {!provider && (
          <>
            <TextFieldSet
              className={SECTION_CLASS}
              label="비밀번호"
              type="password"
              name="password"
              error={errors.password}
              placeholder="······"
              autoComplete="new-password"
            />
            <TextFieldSet
              className={SECTION_CLASS}
              label="비밀번호 확인"
              type="password"
              name="passwordConfirm"
              error={errors.passwordConfirm}
              placeholder="······"
              autoComplete="new-password"
            />
          </>
        )}
        <TextFieldSet
          className={SECTION_CLASS}
          label="이름"
          name="name"
          defaultValue={user.name}
          error={errors.name}
          placeholder="이름"
          autoComplete="name"
        />
        {/* type="date"는 브라우저마다 모양이 달라 시안의 placeholder를 살리려고 텍스트로 받는다 */}
        <TextFieldSet
          className={SECTION_CLASS}
          label="생년월일"
          name="birthDate"
          error={errors.birthDate}
          placeholder="YYYY - MM - DD"
          inputMode="numeric"
          autoComplete="bday"
          value={birthDate}
          onChange={(event) => setBirthDate(formatBirthDate(event.target.value))}
        />
      </section>
    </form>
  );
}
