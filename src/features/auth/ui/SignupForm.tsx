import {
  useRef,
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

import { getApiErrorMessage } from '@/shared/apis/response';

import { useRegisterMutation } from '../api/useRegisterMutation';
import { createRegisterBody } from '../lib/createRegisterBody';
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
  onComplete: () => void;
}

export function SignupForm({ method, onLogin, onComplete }: SignupFormProps) {
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
  const register = useRegisterMutation();
  const submitting = useRef(false);
  const [message, setMessage] = useState('');
  const errors = validateSignup(values, method);

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.currentTarget;
    setValues((previous) => ({ ...previous, [name]: value }));
    setMessage('');
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
      disabled: register.isPending,
    };
  }

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting.current) return;
    setSubmitted(true);
    setMessage('');
    const firstInvalidField = Object.keys(errors)[0];
    if (firstInvalidField) {
      const input = event.currentTarget.elements.namedItem(firstInvalidField);
      if (input instanceof HTMLInputElement) input.focus();
      return;
    }
    if (method !== 'email') {
      setMessage('카카오 회원가입은 준비 중입니다. 이메일로 가입해주세요.');
      return;
    }
    submitting.current = true;
    try {
      await register.mutateAsync(createRegisterBody(values));
      setValues((previous) => ({ ...previous, password: '', passwordConfirmation: '' }));
      setSubmitted(false);
      setTouched({});
      setCompletionOpen(true);
    } catch (error) {
      setMessage(getApiErrorMessage(error));
    } finally {
      submitting.current = false;
    }
  }

  return (
    <form
      noValidate
      aria-busy={register.isPending}
      onSubmit={handleSubmit}
      className="mx-auto w-full max-w-[688px] pt-8 pb-16 font-auth"
    >
      <div className="space-y-4 px-4 py-3">
        <p className="px-1.5 text-sm leading-6 font-light text-neutral-400">프로필 사진</p>
        <ProfileAvatar alt="기본 프로필 사진" className="size-24" loading="eager" />
        <div>
          <label className="inline-flex items-center gap-1 rounded-xs border border-neutral-200 px-2 pt-0.5 pb-1 text-xs leading-5 text-neutral-400">
            <input type="file" disabled aria-label="프로필 사진 추가" className="sr-only" />
            <AddPhotoAlternateIcon aria-hidden="true" className="size-3.5 opacity-40" />
            프로필 사진 추가
          </label>
          <p className="mt-1 text-xs leading-5 text-neutral-400">
            프로필 사진 등록은 준비 중입니다. 사진 없이 가입할 수 있습니다.
          </p>
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
        hint="* 영문과 숫자 3~20글자"
        required
      />
      <SignupField {...getFieldProps('introduction')} label="한 줄 소개" placeholder="한 줄 소개" />
      <div className="mt-8 px-4">
        <GitlogButton type="submit" disabled={register.isPending} className="w-full text-sm">
          {register.isPending ? '가입 중...' : '회원가입 완료'}
        </GitlogButton>
      </div>
      {message && (
        <p role="alert" className="mt-4 px-4 text-sm text-gitlog-danger">
          {message}
        </p>
      )}
      <AuthNoticeDialog
        kind="signupComplete"
        open={completionOpen}
        onOpenChange={(open) => {
          setCompletionOpen(open);
          if (!open) onComplete();
        }}
        onAction={onLogin}
      />
    </form>
  );
}
