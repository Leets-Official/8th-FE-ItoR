import {
  useEffect,
  useState,
  type ChangeEvent,
  type ComponentProps,
  type FocusEvent,
  type SubmitEvent,
} from 'react';

import { AddPhotoAlternateIcon, KakaoIcon } from '@/shared/assets/icons';
import { GitlogButton } from '@/shared/ui/GitlogButton';
import { ProfileAvatar } from '@/shared/ui/ProfileAvatar';
import { TextField } from '@/shared/ui/TextField';

import { validateSignup } from '../lib/validateSignup';
import type { SignupFieldName, SignupMethod, SignupValues } from '../model/signup';
import { AuthNoticeDialog } from './AuthNoticeDialog';

interface SignupFieldProps extends Omit<ComponentProps<'input'>, 'name' | 'size'> {
  name: SignupFieldName;
  label: string;
  error?: string;
  hint?: string;
}

function SignupField({ name, label, error, hint, ...props }: SignupFieldProps) {
  const id = `signup-${name}`;
  const descriptionId = error || hint ? `${id}-description` : undefined;

  return (
    <div className="px-4 py-3">
      <label
        htmlFor={id}
        className="mb-3 block px-1.5 text-sm leading-6 font-light text-neutral-400"
      >
        {label}
      </label>
      <TextField
        {...props}
        id={id}
        name={name}
        aria-invalid={Boolean(error)}
        aria-describedby={descriptionId}
        className="h-12 rounded-sm border-neutral-200 bg-white px-4 text-sm font-light placeholder:text-stone-300 focus-visible:border-gitlog-action aria-invalid:border-neutral-200"
      />
      {error ? (
        <p
          id={descriptionId}
          className="mt-1 px-1.5 text-xs leading-5 font-light text-gitlog-danger"
        >
          {error}
        </p>
      ) : hint ? (
        <p id={descriptionId} className="mt-1 px-1.5 text-xs leading-5 font-light text-stone-300">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

interface SignupFormProps {
  method: SignupMethod;
  onLogin: () => void;
}

export function SignupForm({ method, onLogin }: SignupFormProps) {
  const [values, setValues] = useState<SignupValues>({
    email: '',
    password: '',
    passwordConfirmation: '',
    name: '',
    birthDate: '',
    nickname: '',
    introduction: '',
  });
  const [touched, setTouched] = useState<Partial<Record<SignupFieldName, boolean>>>({});
  const [submitted, setSubmitted] = useState(false);
  const [completionOpen, setCompletionOpen] = useState(false);
  const [photo, setPhoto] = useState<{ file: File; url: string } | null>(null);
  const [photoError, setPhotoError] = useState('');
  const errors = validateSignup(values, method);

  useEffect(() => {
    if (!photo) return;
    return () => URL.revokeObjectURL(photo.url);
  }, [photo]);

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.currentTarget;
    setValues((previous) => ({ ...previous, [name]: value }));
  }

  function handleBlur(event: FocusEvent<HTMLInputElement>) {
    const { name } = event.currentTarget;
    setTouched((previous) => ({ ...previous, [name]: true }));
  }

  function getFieldProps(name: SignupFieldName) {
    return {
      name,
      value: values[name],
      error: submitted || touched[name] ? errors[name] : undefined,
      onChange: handleChange,
      onBlur: handleBlur,
    };
  }

  function handlePhotoChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setPhotoError('* 이미지 파일을 선택해주세요.');
      event.currentTarget.value = '';
      return;
    }
    setPhoto({ file, url: URL.createObjectURL(file) });
    setPhotoError('');
  }

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
    const firstInvalidField = Object.keys(errors)[0];
    if (firstInvalidField) {
      const input = event.currentTarget.elements.namedItem(firstInvalidField);
      if (input instanceof HTMLInputElement) input.focus();
      return;
    }
    if (photoError) return;
    // ponytail: UI 미리보기용 완료 상태. 가입 API 연동 시 성공 응답 이후에만 연다.
    setCompletionOpen(true);
  }

  return (
    <form
      noValidate
      onSubmit={handleSubmit}
      className="mx-auto w-full max-w-[688px] pt-8 pb-16 font-auth"
    >
      <div className="space-y-4 px-4 py-3">
        <p className="px-1.5 text-sm leading-6 font-light text-neutral-400">프로필 사진</p>
        <ProfileAvatar
          alt={photo ? '선택한 프로필 사진' : '기본 프로필 사진'}
          src={photo?.url}
          className="size-24"
          loading="eager"
          onError={() => {
            setPhoto(null);
            setPhotoError('* 프로필 사진을 불러올 수 없습니다. 다른 이미지 파일을 선택해주세요.');
          }}
        />
        <div>
          <label className="inline-flex cursor-pointer items-center gap-1 rounded-xs border border-neutral-200 px-2 pt-0.5 pb-1 text-xs leading-5 text-neutral-400 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-gitlog-action">
            <input
              type="file"
              name="profilePhoto"
              accept="image/*"
              aria-label="프로필 사진 추가"
              aria-invalid={Boolean(photoError)}
              aria-describedby={photoError ? 'signup-photo-error' : undefined}
              className="sr-only"
              onChange={handlePhotoChange}
            />
            <AddPhotoAlternateIcon aria-hidden="true" className="size-3.5 opacity-40" />
            프로필 사진 추가
          </label>
          {photoError && (
            <p
              id="signup-photo-error"
              role="alert"
              className="mt-1 text-xs leading-5 text-gitlog-danger"
            >
              {photoError}
            </p>
          )}
        </div>
      </div>
      {method === 'kakao' && (
        <div className="px-4 py-3">
          <label
            htmlFor="signup-social"
            className="mb-3 block px-1.5 text-sm leading-6 font-light text-neutral-400"
          >
            소셜 로그인
          </label>
          <div className="relative">
            <KakaoIcon
              aria-hidden="true"
              className="pointer-events-none absolute top-4 left-4 size-4 text-kakao-text"
            />
            <TextField
              id="signup-social"
              value="카카오 로그인"
              disabled
              className="h-12 rounded-sm border-neutral-200 pl-10 text-sm font-light"
            />
          </div>
        </div>
      )}
      <SignupField
        {...getFieldProps('email')}
        label="이메일"
        type="email"
        placeholder="이메일"
        autoComplete="email"
        required
      />
      {method === 'email' && (
        <>
          <SignupField
            {...getFieldProps('password')}
            label="비밀번호"
            type="password"
            placeholder="......"
            autoComplete="new-password"
            required
          />
          <SignupField
            {...getFieldProps('passwordConfirmation')}
            label="비밀번호 확인"
            type="password"
            placeholder="......"
            autoComplete="new-password"
            required
          />
        </>
      )}
      <SignupField
        {...getFieldProps('name')}
        label="이름"
        placeholder="이름"
        autoComplete="name"
        required
      />
      <SignupField
        {...getFieldProps('birthDate')}
        label="생년월일"
        placeholder="YYYY - MM - DD"
        autoComplete="bday"
        required
      />
      <SignupField
        {...getFieldProps('nickname')}
        label="닉네임"
        placeholder="닉네임"
        autoComplete="nickname"
        hint="* 20글자 이내"
        required
      />
      <SignupField {...getFieldProps('introduction')} label="한 줄 소개" placeholder="한 줄 소개" />
      <div className="mt-8 px-4">
        <GitlogButton type="submit" className="w-full text-sm">
          회원가입 완료
        </GitlogButton>
      </div>
      <AuthNoticeDialog
        kind="signupComplete"
        open={completionOpen}
        onOpenChange={setCompletionOpen}
        onAction={onLogin}
      />
    </form>
  );
}
