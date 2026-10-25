import { Link } from '@tanstack/react-router';

/** 헤더에서 사용하며 클릭하면 메인 페이지로 이동하는 GITLOG 텍스트 로고입니다. */
export function Logo() {
  return (
    <Link to="/" className="text-logo" aria-label="메인 페이지로 이동">
      GITLOG
    </Link>
  );
}
