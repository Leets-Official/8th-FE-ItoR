import { useState, type FormEvent } from 'react';

import { useAuth } from '@/shared/auth/hooks/useAuth';
import { getApiErrorMessage } from '@/shared/api/apiClient';
import { isValidEmail } from '@/shared/utils/userValidation';

type UseEmailLoginOptions = {
  onSuccess: () => void;
};

type LoginField = 'email' | 'password';

type LoginError = {
  field: LoginField;
  message: string;
};

function getRejectedLoginError(error: unknown): LoginError {
  const apiErrorMessage = getApiErrorMessage(error, '');

  if (apiErrorMessage.includes('가입되지 않은') || apiErrorMessage.includes('찾을 수 없')) {
    return { field: 'email', message: '가입되지 않은 이메일입니다.' };
  }

  if (apiErrorMessage.includes('이메일') && apiErrorMessage.includes('형식')) {
    return { field: 'email', message: '이메일 형식이 적합하지 않습니다.' };
  }

  return { field: 'password', message: '비밀번호가 일치하지 않습니다.' };
}

export function useEmailLogin({ onSuccess }: UseEmailLoginOptions) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState<LoginError | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateEmail(value: string) {
    setEmail(value);

    if (loginError?.field === 'email') {
      setLoginError(null);
    }
  }

  function updatePassword(value: string) {
    setPassword(value);

    if (loginError?.field === 'password') {
      setLoginError(null);
    }
  }

  async function submitLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalizedEmail = email.trim();

    if (!isValidEmail(normalizedEmail)) {
      setLoginError({ field: 'email', message: '이메일 형식이 적합하지 않습니다.' });
      return;
    }

    if (!password) {
      setLoginError({ field: 'password', message: '비밀번호가 일치하지 않습니다.' });
      return;
    }

    setIsSubmitting(true);
    setLoginError(null);

    try {
      await login({ email: normalizedEmail, password });
      onSuccess();
    } catch (error) {
      setLoginError(getRejectedLoginError(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    email,
    password,
    loginError,
    isSubmitting,
    updateEmail,
    updatePassword,
    submitLogin,
  };
}
