import type { MouseEventHandler, ReactNode } from 'react';
import { Dialog as DialogPrimitive } from 'radix-ui';
import logo from '@/shared/assets/images/profile_64.svg';
import { cn } from '@/shared/lib/utils';
import { Button } from './Button';

interface SidebarProfile {
  nickname: ReactNode;
  introduction?: ReactNode;
}

type ButtonClickHandler = MouseEventHandler<HTMLButtonElement>;

interface SidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  // 있으면 로그인 상태(프로필 + 나의 깃로그·쓰기·설정·로그아웃), 없으면 비로그인 상태(시작하기)
  profile?: SidebarProfile;
  description?: ReactNode;
  // 로그인 상태에서 프로필 영역(로고·닉네임·소개)을 누르면 호출 — 계정 설정 페이지로 이동
  onProfileClick?: ButtonClickHandler;
  onStart?: ButtonClickHandler;
  onMyBlog?: ButtonClickHandler;
  onWrite?: ButtonClickHandler;
  onSettings?: ButtonClickHandler;
  onLogout?: ButtonClickHandler;
  className?: string;
}

// 시안의 버튼 높이는 38px로 기본 Button(40px)보다 작다
const BUTTON_HEIGHT_CLASS = 'h-[38px]';

// 헤더의 메뉴(햄버거) 버튼으로 여는 왼쪽 서랍 — 포커스 가두기, ESC·바깥 클릭 닫기, 스크롤 잠금은 Radix Dialog가 처리한다
export function Sidebar({
  open,
  onOpenChange,
  profile,
  description = 'You can make anything by writing',
  onProfileClick,
  onStart,
  onMyBlog,
  onWrite,
  onSettings,
  onLogout,
  className,
}: SidebarProps) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/40 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content
          aria-describedby={undefined}
          className={cn(
            'fixed inset-y-0 left-0 z-50 flex w-60 flex-col justify-between overflow-y-auto border-r border-gray-90 bg-gray-96 outline-none data-[state=closed]:animate-out data-[state=closed]:slide-out-to-left data-[state=open]:animate-in data-[state=open]:slide-in-from-left',
            className,
          )}
        >
          <DialogPrimitive.Title className="sr-only">메뉴</DialogPrimitive.Title>
          <div className="flex flex-col py-6">
            {profile ? (
              <button
                type="button"
                className="flex cursor-pointer flex-col text-left outline-none focus-visible:bg-gray-90"
                onClick={onProfileClick}
              >
                <span className="flex px-4">
                  <img src={logo} alt="" className="size-16" />
                </span>
                <span className="flex flex-col gap-3 px-5 py-3">
                  <span className="text-24 font-medium text-black">{profile.nickname}</span>
                  {profile.introduction && (
                    <span className="text-14 font-light text-gray-20">{profile.introduction}</span>
                  )}
                </span>
              </button>
            ) : (
              <>
                <div className="flex px-4">
                  <img src={logo} alt="GITLOG" className="size-16" />
                </div>
                <p className="px-5 py-3 text-14 font-light text-gray-20">{description}</p>
              </>
            )}
            <div aria-hidden className="h-5" />
            <div className="flex gap-2.5 px-4">
              {profile ? (
                <>
                  <Button
                    variant="point"
                    className={cn('flex-1', BUTTON_HEIGHT_CLASS)}
                    onClick={onMyBlog}
                  >
                    나의 깃로그
                  </Button>
                  <Button
                    variant="point"
                    className={cn('flex-1', BUTTON_HEIGHT_CLASS)}
                    onClick={onWrite}
                  >
                    깃로그 쓰기
                  </Button>
                </>
              ) : (
                <Button variant="point" className={BUTTON_HEIGHT_CLASS} onClick={onStart}>
                  깃로그 시작하기
                </Button>
              )}
            </div>
          </div>

          {profile && (
            <div className="flex flex-col py-6">
              <div aria-hidden className="h-5" />
              <div className="flex justify-end gap-2.5 px-4">
                <Button
                  variant="outline"
                  className={cn('w-[99px]', BUTTON_HEIGHT_CLASS)}
                  onClick={onSettings}
                >
                  설정
                </Button>
                <Button
                  variant="outline"
                  className={cn('w-[99px]', BUTTON_HEIGHT_CLASS)}
                  onClick={onLogout}
                >
                  로그아웃
                </Button>
              </div>
            </div>
          )}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
