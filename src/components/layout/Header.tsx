import { Menu } from 'lucide-react';
import { useState, type ReactNode } from 'react';
import { Link } from 'react-router';
import IconButton from '@/components/common/IconButton';
import Logo from '@/components/common/Logo';
import { ROUTES } from '@/constants/routes';
import Sidebar from './Sidebar';

interface HeaderProps {
  /** 페이지마다 다른 오른쪽 버튼 영역 (깃로그 쓰기 / 게시하기 / 저장하기 등) */
  actions?: ReactNode;
}

function Header({ actions }: HeaderProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-30 bg-white">
        <div className="flex h-14 items-center justify-between px-4 md:h-16 md:px-6">
          <div className="flex items-center gap-3">
            <IconButton
              aria-label="메뉴 열기"
              aria-expanded={isSidebarOpen}
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu size={20} aria-hidden />
            </IconButton>
            <Link to={ROUTES.HOME} aria-label="GITLOG 홈으로 이동">
              <Logo />
            </Link>
          </div>
          {actions && <div className="flex items-center gap-4 md:gap-5">{actions}</div>}
        </div>
      </header>
      {isSidebarOpen && <Sidebar onClose={() => setIsSidebarOpen(false)} />}
    </>
  );
}

export default Header;
