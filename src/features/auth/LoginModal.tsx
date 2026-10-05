import { useState, type SubmitEvent } from 'react';
import { Dialog as DialogPrimitive } from 'radix-ui';
import { Icon } from '@/shared/ui';
import { LoginFields } from './LoginFields';
import type { LoginError } from './types';
import { useAuth } from './useAuth';

interface LoginModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onKakaoLogin?: () => void;
  onSignUp?: () => void;
}

type LoginFailure = LoginError | 'invalid-email-format';

const LOGIN_ERROR_MESSAGE: Record<LoginFailure, string> = {
  'invalid-email-format': '*이메일 형식이 적합하지 않습니다.',
  'unregistered-email': '*가입되지 않은 이메일입니다.',
  'wrong-password': '*비밀번호가 일치하지 않습니다.',
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function LoginModal({ open, onOpenChange, onKakaoLogin, onSignUp }: LoginModalProps) {
  const { login } = useAuth();
  const [failure, setFailure] = useState<LoginFailure>();

  function handleOpenChange(nextOpen: boolean) {
    // 다시 열었을 때 이전 실패 메시지가 남지 않게 한다
    if (!nextOpen) setFailure(undefined);
    onOpenChange(nextOpen);
  }

  // 회원가입 페이지로 넘어갈 때 모달이 열린 채 남지 않게 먼저 닫는다
  function handleSignUp() {
    handleOpenChange(false);
    onSignUp?.();
  }

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = String(formData.get('email') ?? '').trim();
    const password = String(formData.get('password') ?? '');

    // 형식이 틀린 이메일은 로그인 요청 전에 걸러낸다
    if (!EMAIL_PATTERN.test(email)) {
      setFailure('invalid-email-format');
      return;
    }

    const error = login(email, password);
    if (error) {
      setFailure(error);
      return;
    }

    handleOpenChange(false);
  }

  return (
    <DialogPrimitive.Root open={open} onOpenChange={handleOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/40 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content className="fixed top-1/2 left-1/2 z-50 flex min-h-[469px] w-[min(782px,calc(100vw-32px))] -translate-x-1/2 -translate-y-1/2 flex-wrap content-center items-center justify-center rounded-[9px] bg-gray-7 py-20 outline-none data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95">
          <DialogPrimitive.Title className="sr-only">로그인</DialogPrimitive.Title>
          <DialogPrimitive.Description className="sr-only">
            댓글을 작성하려면 로그인해주세요.
          </DialogPrimitive.Description>

          <div className="flex min-w-60 flex-1 flex-col items-center">
            <div className="flex h-40 w-full max-w-[344px] min-w-60 items-center justify-center">
              <span className="font-smooch text-[76px] leading-none text-white">GITLOG</span>
            </div>
            <p className="w-full max-w-[344px] min-w-60 px-4 py-3 text-center text-14 font-light text-gray-56">
              You can make anything by writing
            </p>
          </div>

          {/* 브라우저 기본 검증 말풍선 대신 시안의 에러 문구로 보여주기 위해 직접 검증한다 */}
          <form
            noValidate
            className="flex min-w-60 flex-1 flex-col items-center gap-0.5"
            onSubmit={handleSubmit}
          >
            <div className="h-[33px] w-full max-w-[344px] min-w-60" />
            <LoginFields
              errorMessage={failure && LOGIN_ERROR_MESSAGE[failure]}
              invalidField={failure === 'wrong-password' ? 'password' : 'email'}
            />
            <div className="w-full max-w-[344px] min-w-60 px-4 py-1">
              <button
                type="submit"
                className="flex h-[45px] w-full cursor-pointer items-center justify-center rounded-[6px] bg-point px-3.5 text-14 text-white hover:brightness-95 active:brightness-90"
              >
                이메일로 로그인
              </button>
            </div>
            <div className="flex w-[313px] max-w-full items-center justify-center gap-0.5">
              <span className="h-px w-[123px] shrink bg-gray-20" />
              <span className="px-2 py-0.5 text-12 text-gray-56">SNS</span>
              <span className="h-px w-[123px] shrink bg-gray-20" />
            </div>
            <div className="w-full max-w-[344px] min-w-60 px-4 py-1">
              <button
                type="button"
                className="flex h-[45px] w-full cursor-pointer items-center justify-center gap-2 rounded-[6px] bg-kakao px-3.5 text-[15px] leading-[1.5] font-medium text-black/85 hover:brightness-95 active:brightness-90"
                onClick={onKakaoLogin}
              >
                <Icon name="kakao" size={24} />
                카카오로 로그인
              </button>
            </div>
            <button
              type="button"
              className="rounded-xs px-2 pt-0.5 pb-1 text-12 text-gray-56 hover:bg-gray-20 active:bg-gray-20"
              onClick={handleSignUp}
            >
              또는 회원가입
            </button>
          </form>

          <DialogPrimitive.Close className="absolute top-4 right-4 inline-flex cursor-pointer rounded-sm text-white outline-none hover:bg-gray-20 focus-visible:bg-gray-20 active:bg-gray-20">
            <Icon name="clear" size={40} />
            <span className="sr-only">로그인 팝업 닫기</span>
          </DialogPrimitive.Close>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
