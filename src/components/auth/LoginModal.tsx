import { MessageCircle, X } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { Link } from 'react-router';
import Button from '@/components/common/Button';
import IconButton from '@/components/common/IconButton';
import Logo from '@/components/common/Logo';
import Modal from '@/components/common/Modal';
import { ROUTES } from '@/constants/routes';
import { VALIDATION_MESSAGE } from '@/constants/validation';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { isBlank, isEmail } from '@/utils/validators';

interface LoginModalProps {
  onClose: () => void;
}

const DARK_INPUT_CLASS =
  'h-9 w-full rounded-xs bg-white px-3 text-sm text-ink outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-point';

function LoginModal({ onClose }: LoginModalProps) {
  const { login } = useAuth();
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const completeLogin = () => {
    login();
    showToast('success', '로그인되었습니다!');
    onClose();
  };

  const handleEmailLogin = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isBlank(email) || isBlank(password)) return setErrorMessage(VALIDATION_MESSAGE.REQUIRED);
    if (!isEmail(email)) return setErrorMessage(VALIDATION_MESSAGE.INVALID_EMAIL);
    completeLogin();
  };

  return (
    <Modal onClose={onClose} className="relative max-w-[700px] rounded-sm bg-ink">
      {(titleId) => (
        <>
          <h2 id={titleId} className="sr-only">
            로그인
          </h2>
          <IconButton
            aria-label="로그인 창 닫기"
            onClick={onClose}
            className="absolute top-3 right-3 text-white hover:bg-white/10"
          >
            <X size={20} aria-hidden />
          </IconButton>

          <div className="flex flex-col items-center gap-8 px-6 pt-14 pb-8 md:flex-row md:justify-between md:gap-10 md:px-12 md:py-16">
            <div className="flex flex-col items-center gap-4 md:w-1/2">
              <Logo size="lg" isInverted />
              <p className="text-xs text-gray-500">You can make anything by writing</p>
            </div>

            <div className="flex w-full flex-col gap-2 md:w-[260px]">
              <form noValidate onSubmit={handleEmailLogin} className="flex flex-col gap-2">
                <label htmlFor="login-email" className="sr-only">
                  이메일
                </label>
                <input
                  id="login-email"
                  type="email"
                  autoComplete="email"
                  placeholder="이메일"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className={DARK_INPUT_CLASS}
                  autoFocus
                />
                <label htmlFor="login-password" className="sr-only">
                  비밀번호
                </label>
                <input
                  id="login-password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="비밀번호"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  aria-describedby={errorMessage ? 'login-error' : undefined}
                  className={DARK_INPUT_CLASS}
                />
                {errorMessage && (
                  <p id="login-error" role="alert" className="text-xs text-danger">
                    * {errorMessage}
                  </p>
                )}
                <Button type="submit" variant="solid-point" size="md" fullWidth>
                  이메일로 로그인
                </Button>
              </form>

              <p className="relative my-1 text-center text-[11px] text-gray-500 before:absolute before:top-1/2 before:left-0 before:h-px before:w-[42%] before:bg-gray-700 after:absolute after:top-1/2 after:right-0 after:h-px after:w-[42%] after:bg-gray-700">
                SNS
              </p>

              <Button variant="kakao" size="md" fullWidth onClick={completeLogin}>
                <MessageCircle size={16} fill="currentColor" aria-hidden />
                카카오로 로그인
              </Button>
              <Link
                to={ROUTES.SIGNUP}
                onClick={onClose}
                className="mt-1 self-center text-xs text-gray-400 underline-offset-2 hover:underline"
              >
                또는 회원가입
              </Link>
            </div>
          </div>
        </>
      )}
    </Modal>
  );
}

export default LoginModal;
