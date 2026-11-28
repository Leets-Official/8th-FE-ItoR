import { useRef } from 'react';

import { ClearIcon } from '@/shared/assets/icons';
import { IconButton } from '@/shared/ui/IconButton';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/shared/ui/primitives/dialog';

import type { LoginHandler } from '../model/login';
import { LoginForm } from './LoginForm';

interface LoginDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLogin: LoginHandler;
}

export function LoginDialog({ open, onOpenChange, onLogin }: LoginDialogProps) {
  const returnFocus = useRef<HTMLElement | null>(null);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
        <LoginForm onSignup={() => onOpenChange(false)} onLogin={onLogin} />
      </DialogContent>
    </Dialog>
  );
}
