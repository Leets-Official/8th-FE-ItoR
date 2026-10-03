import { useId, type ComponentProps, type ReactNode } from 'react';
import { TextField } from '@/shared/ui';

type LoginTextFieldProps = Omit<
  ComponentProps<typeof TextField>,
  'type' | 'name' | 'placeholder' | 'size'
>;

interface LoginFieldsProps {
  errorMessage?: ReactNode;
  emailInputProps?: LoginTextFieldProps;
  passwordInputProps?: LoginTextFieldProps;
}

export function LoginFields({
  errorMessage,
  emailInputProps,
  passwordInputProps,
}: LoginFieldsProps) {
  const errorId = useId();

  return (
    <div className="flex w-[312px] max-w-full min-w-60 flex-col items-start gap-2 px-4 py-1">
      <TextField
        type="email"
        name="email"
        placeholder="이메일"
        autoComplete="email"
        {...emailInputProps}
      />
      <TextField
        type="password"
        name="password"
        placeholder="비밀번호"
        autoComplete="current-password"
        aria-describedby={errorMessage ? errorId : undefined}
        aria-invalid={errorMessage ? true : undefined}
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
