import { type MouseEvent } from 'react';
import { createPortal } from 'react-dom';

import { ClearIcon } from '@/shared/assets/icons/icons';
import { BrandPanel } from '@/shared/ui/auth/BrandPanel';
import { LoginMethodButton } from '@/shared/ui/auth/LoginMethodButton';
import { IconButton } from '@/shared/ui/button/IconButton';
import GitlogLogo from '@/shared/ui/logo/GITLOG.svg?react';
import { TextField } from '@/shared/ui/input/TextField';

type LoginDialogProps = {
  onClose: () => void;
};

/** @returns 로그인 UI와 딤드 배경을 표시하는 모달 */
export function LoginDialog({ onClose }: LoginDialogProps) {
  function handleBackdropClick(event: MouseEvent<HTMLDivElement>) {
    if (event.target === event.currentTarget) {
      onClose();
    }
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[rgba(182,182,182,0.3)] px-4 backdrop-blur-[4px]"
      onClick={handleBackdropClick}
    >
      {/* 로그인 팝업 */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="로그인"
        className="relative flex h-fit w-full max-w-[782px] items-center justify-center rounded-[9px] bg-gray-7 py-20 mobile:flex-col"
      >
        <div className="absolute right-4 top-4 [&_path]:fill-white">
          <IconButton icon={ClearIcon} label="로그인 모달 닫기" onClick={onClose} />
        </div>

        <BrandPanel logo={GitlogLogo} />

        {/* 우측 로그인 버튼 */}
        <div className="flex h-fit w-full min-w-[240px] flex-col items-center justify-center gap-0.5 px-4">
          <div className="flex h-fit w-full min-w-[240px] max-w-[344px] flex-col gap-2.5 px-4 py-1" />
          <div className="flex h-fit w-full min-w-[240px] max-w-[344px] flex-col gap-2 px-4 py-1">
            <TextField
              variant="14"
              inputType="email"
              placeholder="이메일"
              backgroundColor="#ffffff"
            />
            <TextField
              variant="14"
              inputType="password"
              placeholder="비밀번호"
              backgroundColor="#ffffff"
            />
          </div>
          <div className="flex h-fit w-full min-w-[240px] max-w-[344px] gap-2.5 px-4 py-1">
            <LoginMethodButton method="email" onClick={onClose} />
          </div>
          <div className="flex w-[313px] items-center gap-0.5">
            <div className="h-px flex-1 bg-gray-20" />
            <div className="flex shrink-0 rounded-[2px] px-2 pb-1 pt-0.5">
              <span className="text-12-regular text-gray-56">SNS</span>
            </div>
            <div className="h-px flex-1 bg-gray-20" />
          </div>
          <div className="flex h-fit w-full min-w-[240px] max-w-[344px] gap-2.5 px-4 py-1">
            <LoginMethodButton method="kakao" />
          </div>

          <div className="flex h-fit w-fit items-center justify-center gap-1 rounded-[2px] px-2 pb-1 pt-0.5">
            <span className="text-12-regular text-gray-56">또는 회원가입</span>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
