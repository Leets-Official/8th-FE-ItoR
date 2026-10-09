import { useRef, useState, type ChangeEvent, type SubmitEvent } from 'react';
import defaultProfile from '@/shared/assets/images/profile_90.svg';
import { Blank, Button, Icon, showToast, TextFieldSet } from '@/shared/ui';
import { cn } from '@/shared/lib/utils';
import type { SignUpInput, SocialProvider } from '../model/types';
import { useAuth } from '../model/useAuth';

type SignUpField =
  'email' | 'password' | 'passwordConfirm' | 'name' | 'birthDate' | 'nickname' | 'introduction';
type SignUpFieldErrors = Partial<Record<SignUpField, string>>;

// 화면에 놓인 순서. 문구가 붙은 첫 칸으로 포커스를 옮길 때 이 순서를 따른다
const SIGN_UP_FIELDS: SignUpField[] = [
  'email',
  'password',
  'passwordConfirm',
  'name',
  'birthDate',
  'nickname',
  'introduction',
];

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const BIRTH_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const NAME_MAX_LENGTH = 10;
const NICKNAME_MAX_LENGTH = 20;
const INTRODUCTION_MAX_LENGTH = 30;

// 시안 플로우의 "조건이 맞지 않는 폼" 문구. 로그인 모달과 같은 "*…." 형식으로 맞춘다
const ERROR_MESSAGE = {
  required: '*반드시 입력해야하는 필수 사항입니다.',
  invalidEmail: '*이메일 형식이 적합하지 않습니다.',
  duplicateEmail: '*사용중인 이메일입니다.',
  passwordMismatch: '*비밀번호가 일치하지 않습니다.',
  nameTooLong: `*이름은 최대 ${NAME_MAX_LENGTH}글자 입니다.`,
  invalidBirthDate: '*생년월일 형식이 적합하지 않습니다.',
  nicknameTooLong: `*닉네임은 최대 ${NICKNAME_MAX_LENGTH}글자 입니다.`,
  introductionTooLong: `* 한 줄 소개는 최대 ${INTRODUCTION_MAX_LENGTH}글자입니다.`,
};

// 시안의 각 입력 영역은 최대 688px 너비에 좌우 16px·위아래 12px 여백
const SECTION_CLASS = 'w-full max-w-[688px]';

// 숫자만 남기고 YYYY-MM-DD 모양으로 하이픈을 끼워 넣는다
function formatBirthDate(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 8);
  return [digits.slice(0, 4), digits.slice(4, 6), digits.slice(6, 8)].filter(Boolean).join('-');
}

// 한 줄 소개는 선택 항목, 소셜 가입은 비밀번호 칸이 없어 필수에서 뺀다
const OPTIONAL_FIELDS: SignUpField[] = ['introduction'];
const PASSWORD_FIELDS: SignUpField[] = ['password', 'passwordConfirm'];

const SOCIAL_PROVIDER_LABEL: Record<SocialProvider, string> = {
  kakao: '카카오 로그인',
};

function getRequiredFields(provider?: SocialProvider) {
  return SIGN_UP_FIELDS.filter(
    (field) => !OPTIONAL_FIELDS.includes(field) && !(provider && PASSWORD_FIELDS.includes(field)),
  );
}

type SignUpValues = Required<Omit<SignUpInput, 'profileImageUrl' | 'provider'>> & {
  passwordConfirm: string;
};

// 입력 순서대로 검사해, 조건이 맞지 않는 칸마다 하나의 문구를 돌려준다
function validateSignUp(values: SignUpValues, provider?: SocialProvider): SignUpFieldErrors {
  const errors: SignUpFieldErrors = {};
  getRequiredFields(provider).forEach((field) => {
    if (!values[field]) errors[field] = ERROR_MESSAGE.required;
  });

  if (!errors.email && !EMAIL_PATTERN.test(values.email)) {
    errors.email = ERROR_MESSAGE.invalidEmail;
  }
  if (!provider && !errors.passwordConfirm && values.password !== values.passwordConfirm) {
    errors.passwordConfirm = ERROR_MESSAGE.passwordMismatch;
  }
  if (!errors.name && values.name.length > NAME_MAX_LENGTH) {
    errors.name = ERROR_MESSAGE.nameTooLong;
  }
  if (!errors.birthDate && !BIRTH_DATE_PATTERN.test(values.birthDate)) {
    errors.birthDate = ERROR_MESSAGE.invalidBirthDate;
  }
  if (!errors.nickname && values.nickname.length > NICKNAME_MAX_LENGTH) {
    errors.nickname = ERROR_MESSAGE.nicknameTooLong;
  }
  if (values.introduction.length > INTRODUCTION_MAX_LENGTH) {
    errors.introduction = ERROR_MESSAGE.introductionTooLong;
  }
  return errors;
}

function readAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

interface SignUpFormProps {
  // 있으면 소셜 가입 — 비밀번호 칸 대신 연결된 소셜 로그인을 보여준다
  provider?: SocialProvider;
  onSuccess?: () => void;
  className?: string;
}

export function SignUpForm({ provider, onSuccess, className }: SignUpFormProps) {
  const { signUp } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  // 새로고침 후에도 사이드바 프로필에 보이도록 object URL 대신 data URL로 보관한다
  const [profileImageUrl, setProfileImageUrl] = useState<string>();
  const [birthDate, setBirthDate] = useState('');
  const [errors, setErrors] = useState<SignUpFieldErrors>({});

  async function handleProfileImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    // 같은 파일을 다시 골라도 change 이벤트가 발생하도록 비운다
    event.target.value = '';
    if (!file) return;

    try {
      setProfileImageUrl(await readAsDataUrl(file));
    } catch {
      showToast('negative', '프로필 사진을 불러오지 못했습니다.');
    }
  }

  // 다시 입력하기 시작한 칸의 문구는 지운다
  function handleFormChange(event: ChangeEvent<HTMLFormElement>) {
    // change 이벤트는 입력창에서 버블링되어 올라오므로 target이 입력창이다
    const { name } = event.target as unknown as HTMLInputElement;
    setErrors((prev) => {
      if (!(name in prev)) return prev;
      const next = { ...prev };
      delete next[name as SignUpField];
      return next;
    });
  }

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const read = (name: string) => String(formData.get(name) ?? '').trim();

    const values: SignUpValues = {
      email: read('email'),
      password: String(formData.get('password') ?? ''),
      passwordConfirm: String(formData.get('passwordConfirm') ?? ''),
      name: read('name'),
      birthDate,
      nickname: read('nickname'),
      introduction: read('introduction'),
    };

    const nextErrors = validateSignUp(values, provider);
    if (Object.keys(nextErrors).length === 0) {
      const { email, password, name, nickname } = values;
      const error = signUp({
        email,
        password: provider ? undefined : password,
        provider,
        name,
        birthDate,
        nickname,
        introduction: values.introduction || undefined,
        profileImageUrl,
      });
      if (error === 'duplicate-email') nextErrors.email = ERROR_MESSAGE.duplicateEmail;
    }

    setErrors(nextErrors);
    // 문구가 붙은 첫 칸으로 키패드를 다시 띄워 바로 고칠 수 있게 한다
    const firstInvalid = SIGN_UP_FIELDS.find((field) => nextErrors[field]);
    if (firstInvalid) {
      form.querySelector<HTMLInputElement>(`[name="${firstInvalid}"]`)?.focus();
      return;
    }

    onSuccess?.();
  }

  return (
    // 브라우저 기본 검증 말풍선 대신 시안의 문구로 보여주기 위해 직접 검증한다
    <form
      noValidate
      className={cn('flex w-full flex-col items-center self-stretch bg-white', className)}
      onChange={handleFormChange}
      onSubmit={handleSubmit}
    >
      <Blank size={32} />

      <div className={cn(SECTION_CLASS, 'flex flex-col gap-4 px-4 py-3')}>
        <p className="px-1.5 text-14 font-light text-gray-56">프로필 사진</p>
        <div className="flex flex-col items-start gap-4">
          <img
            src={profileImageUrl ?? defaultProfile}
            alt=""
            width={90}
            height={90}
            className="size-[90px] rounded-full object-cover"
          />
          <Button
            variant="text"
            icon="add_photo_alternate"
            className="border border-gray-90"
            onClick={() => fileInputRef.current?.click()}
          >
            {profileImageUrl ? '프로필 사진 변경' : '프로필 사진 추가'}
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            hidden
            onChange={handleProfileImageChange}
          />
        </div>
      </div>

      {provider && (
        <div className={cn(SECTION_CLASS, 'flex flex-col gap-3 px-4 py-3')}>
          <p className="px-1.5 text-14 font-light text-gray-56">소셜 로그인</p>
          {/* 가입에 쓰는 소셜 계정을 보여주기만 하고 바꿀 수는 없다 */}
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
        error={errors.email}
        placeholder="이메일"
        autoComplete="email"
      />
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
      <TextFieldSet
        className={SECTION_CLASS}
        label="닉네임"
        name="nickname"
        error={errors.nickname}
        placeholder="닉네임"
        autoComplete="nickname"
        caution={`* ${NICKNAME_MAX_LENGTH}글자 이내`}
      />
      <TextFieldSet
        className={SECTION_CLASS}
        label="한 줄 소개"
        name="introduction"
        error={errors.introduction}
        placeholder="한 줄 소개"
      />

      <Blank size={32} />
      <div className={cn(SECTION_CLASS, 'flex px-4')}>
        <Button type="submit" className="h-[38px] flex-1">
          회원가입 완료
        </Button>
      </div>
      <Blank size={64} />
    </form>
  );
}
