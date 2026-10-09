import { useRef, useState, type ReactNode, type SubmitEvent } from 'react';

import { Link } from 'react-router';

import { ClearIcon } from '@/shared/assets/icons';
import { GitlogButton } from '@/shared/ui/GitlogButton';
import { IconButton } from '@/shared/ui/IconButton';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@/shared/ui/primitives/dialog';
import { TextField } from '@/shared/ui/TextField';

import { MOCK_ACCOUNT } from '../model/mockAccount';
import { AuthDivider, EmailAuthButton, KakaoAuthButton } from './AuthMethodButtons';
import { AuthPanel } from './AuthPanel';

function LoginForm({ onSignup, onLogin }: { onSignup: () => void; onLogin: () => void }) {
  const [message, setMessage] = useState('');

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = String(data.get('email') ?? '')
      .trim()
      .toLowerCase();
    const password = String(data.get('password') ?? '');
    if (email !== MOCK_ACCOUNT.email || password !== MOCK_ACCOUNT.password) {
      setMessage('이메일 또는 비밀번호를 확인해주세요.');
      return;
    }
    onLogin();
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-2">
        <label htmlFor="login-email" className="sr-only">
          이메일
        </label>
        <TextField
          id="login-email"
          name="email"
          type="email"
          autoComplete="username"
          placeholder="이메일"
          required
          aria-describedby={message ? 'login-message' : undefined}
          className="h-11 rounded-sm border-neutral-200 bg-white px-4 text-sm font-light placeholder:text-stone-300"
        />
        <label htmlFor="login-password" className="sr-only">
          비밀번호
        </label>
        <TextField
          id="login-password"
          name="password"
          type="password"
          autoComplete="current-password"
          placeholder="비밀번호"
          required
          aria-describedby={message ? 'login-message' : undefined}
          className="h-11 rounded-sm border-neutral-200 bg-white px-4 text-sm font-light placeholder:text-stone-300"
        />
        <div className="pt-1">
          <EmailAuthButton type="submit">이메일로 로그인</EmailAuthButton>
        </div>
      </form>
      <AuthDivider dark />
      <KakaoAuthButton onClick={() => setMessage('카카오 로그인은 준비 중입니다.')}>
        카카오로 로그인
      </KakaoAuthButton>
      <p className="py-1 text-center text-xs leading-5 text-neutral-400">
        또는{' '}
        <Link
          to="/mypage/signup"
          onClick={onSignup}
          className="rounded-sm hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gitlog-action"
        >
          회원가입
        </Link>
      </p>
      {message && (
        <p
          id="login-message"
          role="status"
          className="text-center text-xs leading-5 text-neutral-400"
        >
          {message}
        </p>
      )}
    </>
  );
}

interface LoginDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trigger?: ReactNode;
  onLogin: () => void;
}

export function LoginDialog({ open, onOpenChange, trigger, onLogin }: LoginDialogProps) {
  const returnFocus = useRef<HTMLElement | null>(null);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger !== null && (
        <DialogTrigger asChild>
          {trigger === undefined ? <GitlogButton>로그인</GitlogButton> : trigger}
        </DialogTrigger>
      )}
      <DialogContent
        onOpenAutoFocus={() => {
          returnFocus.current =
            document.activeElement instanceof HTMLElement ? document.activeElement : null;
        }}
        onCloseAutoFocus={(event) => {
          event.preventDefault();
          if (returnFocus.current?.isConnected) returnFocus.current.focus();
          returnFocus.current = null;
        }}
        showCloseButton={false}
        className="max-h-[calc(100dvh-2rem)] max-w-[min(782px,calc(100%-2rem))] overflow-y-auto rounded-lg border-0 bg-neutral-900 p-0 text-white sm:max-w-[min(782px,calc(100%-2rem))]"
      >
        <DialogTitle className="sr-only">로그인</DialogTitle>
        <DialogDescription className="sr-only">
          이메일과 비밀번호 또는 카카오로 로그인할 수 있습니다.
        </DialogDescription>
        <DialogClose asChild>
          <IconButton
            label="로그인 창 닫기"
            className="absolute top-4 right-4 size-10 text-white hover:bg-white/10 hover:text-white"
          >
            <ClearIcon aria-hidden="true" className="size-6 invert" />
          </IconButton>
        </DialogClose>
        <AuthPanel dark>
          <LoginForm onSignup={() => onOpenChange(false)} onLogin={onLogin} />
        </AuthPanel>
      </DialogContent>
    </Dialog>
  );
}
