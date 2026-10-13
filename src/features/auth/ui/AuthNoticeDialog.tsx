import { useRef } from 'react';

import { Button } from '@/shared/ui/primitives/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/primitives/dialog';

export type AuthNoticeKind = 'signupComplete' | 'unregisteredAccount';

interface AuthNoticeDialogProps {
  kind: AuthNoticeKind;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAction: () => void;
}

const notices = {
  signupComplete: {
    title: '회원가입이 완료되었습니다!',
    description: undefined,
    closeLabel: '확인',
    actionLabel: '로그인하기',
  },
  unregisteredAccount: {
    title: '가입되지 않은 계정이에요.',
    description: '회원가입을 진행할까요?',
    closeLabel: '취소',
    actionLabel: '회원가입 하기',
  },
};

export function AuthNoticeDialog({ kind, open, onOpenChange, onAction }: AuthNoticeDialogProps) {
  const notice = notices[kind];
  const returnFocus = useRef<HTMLElement | null>(null);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        {...(notice.description ? {} : { 'aria-describedby': undefined })}
        onOpenAutoFocus={() => {
          returnFocus.current =
            document.activeElement instanceof HTMLElement ? document.activeElement : null;
        }}
        onCloseAutoFocus={(event) => {
          event.preventDefault();
          if (returnFocus.current?.isConnected) returnFocus.current.focus();
          returnFocus.current = null;
        }}
        className="w-80 max-w-[calc(100%-2rem)] gap-6 overflow-hidden rounded-sm bg-white px-4 pt-6 pb-4 font-auth shadow-[0px_2px_8px_0px_rgba(0,0,0,0.10)] ring-0 sm:max-w-80"
      >
        <DialogHeader className="gap-2 px-1 text-left">
          <DialogTitle className="text-sm leading-6 font-normal text-black">
            {notice.title}
          </DialogTitle>
          {notice.description && (
            <DialogDescription className="text-sm leading-6 font-normal text-neutral-400">
              {notice.description}
            </DialogDescription>
          )}
        </DialogHeader>
        <div className="flex gap-3">
          <DialogClose asChild>
            <Button
              type="button"
              variant={null}
              className="h-10 flex-1 rounded-xs border-neutral-100 bg-white px-3 py-2 text-sm leading-6 font-normal text-black hover:bg-neutral-50"
            >
              {notice.closeLabel}
            </Button>
          </DialogClose>
          <Button
            type="button"
            variant={null}
            onClick={() => {
              returnFocus.current = null;
              onOpenChange(false);
              onAction();
            }}
            className="h-10 flex-1 rounded-xs bg-gitlog-action px-3 py-2 text-sm leading-6 font-normal text-white hover:bg-gitlog-action/90"
          >
            {notice.actionLabel}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
