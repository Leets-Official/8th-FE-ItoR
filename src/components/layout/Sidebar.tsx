import { X } from 'lucide-react';
import { createPortal } from 'react-dom';
import { Link, useNavigate } from 'react-router';
import Avatar from '@/components/common/Avatar';
import Button from '@/components/common/Button';
import IconButton from '@/components/common/IconButton';
import { ROUTES } from '@/constants/routes';
import { useAuth } from '@/hooks/useAuth';
import { useBodyScrollLock } from '@/hooks/useBodyScrollLock';
import { useEscapeKey } from '@/hooks/useEscapeKey';
import { useLoginModal } from '@/hooks/useLoginModal';

interface SidebarProps {
  onClose: () => void;
}

/** 햄버거 버튼으로 여는 왼쪽 메뉴. 로그인 여부에 따라 내용이 달라진다. */
function Sidebar({ onClose }: SidebarProps) {
  const { user, logout } = useAuth();
  const { openLoginModal } = useLoginModal();
  const navigate = useNavigate();
  useEscapeKey(onClose);
  useBodyScrollLock();

  const moveTo = (path: string) => {
    onClose();
    navigate(path);
  };

  return createPortal(
    <div className="fixed inset-0 z-40">
      <div aria-hidden className="absolute inset-0 animate-fade-in bg-black/30" onClick={onClose} />

      <aside
        aria-label="사이드 메뉴"
        className="absolute inset-y-0 left-0 flex w-60 animate-slide-in flex-col bg-gray-50 p-4"
      >
        <IconButton aria-label="메뉴 닫기" onClick={onClose} className="absolute top-3 right-3">
          <X size={18} aria-hidden />
        </IconButton>

        {user ? (
          <>
            <Link
              to={ROUTES.PROFILE_SETTINGS}
              onClick={onClose}
              aria-label="내 계정 설정으로 이동"
              className="-m-2 flex flex-col gap-3 rounded-sm p-2 transition-colors hover:bg-gray-100"
            >
              <Avatar src={user.profileImageUrl} alt="" size="lg" />
              <div>
                <p className="text-2xl text-ink">{user.nickname}</p>
                <p className="mt-2 text-sm text-gray-600">{user.introduction}</p>
              </div>
            </Link>
            <div className="mt-6 flex gap-2">
              <Button variant="outline-point" size="md" onClick={() => moveTo(ROUTES.MY_BLOG)}>
                나의 깃로그
              </Button>
              <Button variant="outline-point" size="md" onClick={() => moveTo(ROUTES.POST_WRITE)}>
                깃로그 쓰기
              </Button>
            </div>
            <div className="mt-auto flex gap-2">
              <Button
                variant="outline-gray"
                size="md"
                className="flex-1"
                onClick={() => moveTo(ROUTES.PROFILE_SETTINGS)}
              >
                설정
              </Button>
              <Button
                variant="outline-gray"
                size="md"
                className="flex-1"
                onClick={() => {
                  logout();
                  moveTo(ROUTES.HOME);
                }}
              >
                로그아웃
              </Button>
            </div>
          </>
        ) : (
          <div className="flex flex-col gap-3">
            <Avatar src={null} alt="" size="lg" />
            <p className="text-sm leading-relaxed text-gray-600">
              You can make anything
              <br />
              by writing
            </p>
            <Button
              variant="outline-point"
              size="md"
              className="self-start"
              onClick={() => {
                onClose();
                openLoginModal();
              }}
            >
              깃로그 시작하기
            </Button>
          </div>
        )}
      </aside>
    </div>,
    document.body,
  );
}

export default Sidebar;
