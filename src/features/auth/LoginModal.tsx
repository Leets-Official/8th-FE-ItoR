import type { FormEvent, FormEventHandler, ReactNode } from 'react';
import { Dialog as DialogPrimitive } from 'radix-ui';
import { Icon } from '@/shared/ui';
import { LoginFields } from './LoginFields';

interface LoginModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLogin?: FormEventHandler<HTMLFormElement>;
  onKakaoLogin?: () => void;
  onSignUp?: () => void;
  errorMessage?: ReactNode;
}

export function LoginModal({
  open,
  onOpenChange,
  onLogin,
  onKakaoLogin,
  onSignUp,
  errorMessage,
}: LoginModalProps) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onLogin?.(event);
  }

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/40 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content className="fixed top-1/2 left-1/2 z-50 flex min-h-[469px] w-[min(782px,calc(100vw-32px))] -translate-x-1/2 -translate-y-1/2 flex-wrap content-center items-center justify-center rounded-[9px] bg-gray-7 py-20 outline-none data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95">
          <DialogPrimitive.Title className="sr-only">로그인</DialogPrimitive.Title>
          <DialogPrimitive.Description className="sr-only">
            댓글을 작성하려면 로그인해주세요.
          </DialogPrimitive.Description>

          <div className="flex w-[391px] max-w-full min-w-60 flex-col items-center">
            <div className="flex h-40 w-[344px] max-w-full min-w-60 items-center justify-center">
              <span className="font-smooch text-[76px] leading-none text-white">GITLOG</span>
            </div>
            <p className="w-[344px] max-w-full min-w-60 px-4 py-3 text-center text-14 font-light text-gray-56">
              You can make anything by writing
            </p>
          </div>

          <form
            className="flex w-[391px] max-w-full min-w-60 flex-col items-center px-4"
            onSubmit={handleSubmit}
          >
            <div className="h-[33px] w-[344px] max-w-full min-w-60 px-4 py-1" />
            <LoginFields errorMessage={errorMessage} />
            <div className="w-[312px] max-w-full min-w-60 px-4 py-1">
              <button
                type="submit"
                className="flex h-[45px] w-full cursor-pointer items-center justify-center rounded-[6px] bg-point px-3.5 text-14 text-white hover:brightness-95 active:brightness-90"
              >
                이메일로 로그인
              </button>
            </div>
            <div className="flex h-[25px] w-[280px] max-w-full items-center gap-2">
              <span className="h-px flex-1 bg-gray-20" />
              <span className="px-2 py-0.5 text-12 text-gray-56">SNS</span>
              <span className="h-px flex-1 bg-gray-20" />
            </div>
            <div className="w-[312px] max-w-full min-w-60 px-4 py-1">
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
              onClick={onSignUp}
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
