import { useRef, useState, type SubmitEvent } from 'react';

import { Link } from 'react-router';

import { getApiErrorMessage } from '@/shared/apis/response';
import { TextField } from '@/shared/ui/TextField';

import type { LoginHandler } from '../model/login';
import { AuthDivider, EmailAuthButton, KakaoAuthButton } from './AuthMethodButtons';
import { AuthPanel } from './AuthPanel';

export function LoginForm({ onSignup, onLogin }: { onSignup: () => void; onLogin: LoginHandler }) {
  const [message, setMessage] = useState('');
  const [pending, setPending] = useState(false);
  const submitting = useRef(false);

  async function login(
    method: 'email' | 'kakao',
    credentials?: { email: string; password: string },
  ) {
    if (submitting.current) return;
    submitting.current = true;
    setPending(true);
    setMessage('');
    try {
      await onLogin(method, credentials);
    } catch (error) {
      setMessage(getApiErrorMessage(error, '이메일 또는 비밀번호를 확인해주세요.'));
    } finally {
      submitting.current = false;
      setPending(false);
    }
  }

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = String(data.get('email') ?? '').trim();
    const password = String(data.get('password') ?? '');
    void login('email', { email, password });
  }

  return (
    <AuthPanel dark>
      <form onSubmit={handleSubmit} aria-busy={pending} className="space-y-2">
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
          disabled={pending}
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
          disabled={pending}
          aria-describedby={message ? 'login-message' : undefined}
          className="h-11 rounded-sm border-neutral-200 bg-white px-4 text-sm font-light placeholder:text-stone-300"
        />
        <div className="pt-1">
          <EmailAuthButton type="submit" disabled={pending}>
            {pending ? '로그인 중...' : '이메일로 로그인'}
          </EmailAuthButton>
        </div>
      </form>
      <AuthDivider dark />
      <KakaoAuthButton
        disabled={pending}
        onClick={() => {
          void login('kakao');
        }}
      >
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
    </AuthPanel>
  );
}
