import { type MouseEvent } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from '@tanstack/react-router';

import { getKakaoLoginUrl } from '@/shared/auth/api/authApi';
import { ClearIcon } from '@/shared/assets/icons/icons';
import { AuthMethodButton } from '@/shared/ui/auth/AuthMethodButton';
import { BrandPanel } from '@/shared/ui/auth/BrandPanel';
import { IconButton } from '@/shared/ui/button/IconButton';
import GitlogLogo from '@/shared/ui/logo/GITLOG.svg?react';
import { TextField } from '@/shared/ui/input/TextField';
import { useModalFocus } from '@/shared/ui/dialog/hooks/useModalFocus';

import { useEmailLogin } from '../hooks/useEmailLogin';

type LoginDialogProps = {
  onClose: () => void;
};

/** @returns 로그인 UI와 딤드 배경을 표시하는 모달 */
export function LoginDialog({ onClose }: LoginDialogProps) {
  const dialogRef = useModalFocus<HTMLDivElement>(onClose);
  const navigate = useNavigate();
  const { email, password, loginError, isSubmitting, updateEmail, updatePassword, submitLogin } =
    useEmailLogin({ onSuccess: onClose });
  const emailErrorMessage = loginError?.field === 'email' ? loginError.message : '';
  const passwordErrorMessage = loginError?.field === 'password' ? loginError.message : '';

  function handleBackdropClick(event: MouseEvent<HTMLDivElement>) {
    if (event.target === event.currentTarget) {
      onClose();
    }
  }

  function startKakaoLogin() {
    window.location.assign(getKakaoLoginUrl());
  }

  async function moveToRegisterPage() {
    onClose();
    await navigate({ to: '/register' });
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[rgba(182,182,182,0.3)] px-4 backdrop-blur-[4px]"
      onClick={handleBackdropClick}
    >
      {/* 로그인 팝업 */}
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label="로그인"
        tabIndex={-1}
        className="relative flex h-fit w-full max-w-[782px] items-center justify-center rounded-[9px] bg-gray-7 py-20 mobile:flex-col"
      >
        <div className="absolute right-4 top-4 [&_path]:fill-white">
          <IconButton icon={ClearIcon} label="로그인 모달 닫기" onClick={onClose} />
        </div>

        <BrandPanel logo={GitlogLogo} />

        <form
          className="flex h-fit w-full min-w-[240px] flex-col items-center justify-center gap-0.5 px-4"
          noValidate
          onSubmit={submitLogin}
        >
          <div className="flex h-fit w-full min-w-[240px] max-w-[344px] flex-col gap-2.5 px-4 py-1" />
          <div className="flex h-fit w-full min-w-[240px] max-w-[344px] flex-col gap-2 px-4 py-1">
            <TextField
              variant="14"
              inputType="email"
              placeholder="이메일"
              backgroundColor="#ffffff"
              value={email}
              ariaInvalid={Boolean(emailErrorMessage)}
              ariaDescribedBy={emailErrorMessage ? 'login-email-error' : undefined}
              onChange={updateEmail}
            />
            {emailErrorMessage ? (
              <p id="login-email-error" role="alert" className="text-12-light px-1.5 text-negative">
                *{emailErrorMessage}
              </p>
            ) : null}
            <TextField
              variant="14"
              inputType="password"
              placeholder="비밀번호"
              backgroundColor="#ffffff"
              value={password}
              ariaInvalid={Boolean(passwordErrorMessage)}
              ariaDescribedBy={passwordErrorMessage ? 'login-password-error' : undefined}
              onChange={updatePassword}
            />
            {passwordErrorMessage ? (
              <p
                id="login-password-error"
                role="alert"
                className="text-12-light px-1.5 text-negative"
              >
                *{passwordErrorMessage}
              </p>
            ) : null}
          </div>
          <div className="flex h-fit w-full min-w-[240px] max-w-[344px] gap-2.5 px-4 py-1">
            <AuthMethodButton
              method="email"
              label={isSubmitting ? '로그인 중...' : '이메일로 로그인'}
              type="submit"
              disabled={isSubmitting}
            />
          </div>
          <div className="flex w-[313px] items-center gap-0.5">
            <div className="h-px flex-1 bg-gray-20" />
            <div className="flex shrink-0 rounded-[2px] px-2 pb-1 pt-0.5">
              <span className="text-12-regular text-gray-56">SNS</span>
            </div>
            <div className="h-px flex-1 bg-gray-20" />
          </div>
          <div className="flex h-fit w-full min-w-[240px] max-w-[344px] gap-2.5 px-4 py-1">
            <AuthMethodButton method="kakao" label="카카오로 로그인" onClick={startKakaoLogin} />
          </div>

          <button
            type="button"
            onClick={moveToRegisterPage}
            className="text-12-regular flex h-fit w-fit items-center justify-center gap-1 rounded-[2px] px-2 pb-1 pt-0.5 text-gray-56"
          >
            또는 회원가입
          </button>
        </form>
      </div>
    </div>,
    document.body,
  );
}
