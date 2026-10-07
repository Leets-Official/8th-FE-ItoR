import { useId, type ComponentProps, type ReactNode } from 'react';
import { TextField } from '@/shared/ui';

type LoginTextFieldProps = Omit<
  ComponentProps<typeof TextField>,
  'type' | 'name' | 'placeholder' | 'size'
>;

interface LoginFieldsProps {
  errorMessage?: ReactNode;
  // 에러 메시지가 어느 입력칸의 문제인지 스크린 리더에 알린다
  invalidField?: 'email' | 'password';
  emailInputProps?: LoginTextFieldProps;
  passwordInputProps?: LoginTextFieldProps;
}

export function LoginFields({
  errorMessage,
  invalidField = 'password',
  emailInputProps,
  passwordInputProps,
}: LoginFieldsProps) {
  const errorId = useId();
  const errorProps = errorMessage
    ? { 'aria-describedby': errorId, 'aria-invalid': true }
    : undefined;

  return (
    <div className="flex w-full max-w-[344px] min-w-60 flex-col items-start gap-2 px-4 py-1">
      <TextField
        type="email"
        name="email"
        placeholder="이메일"
        autoComplete="email"
        {...(invalidField === 'email' && errorProps)}
        {...emailInputProps}
      />
      <TextField
        type="password"
        name="password"
        placeholder="비밀번호"
        autoComplete="current-password"
        {...(invalidField === 'password' && errorProps)}
        {...passwordInputProps}
      />
      {errorMessage && (
        <p id={errorId} className="w-full px-1.5 text-12 font-light text-negative">
          {errorMessage}
        </p>
      )}
    </div>
  );
}
