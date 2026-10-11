import { Link } from 'react-router';

import { Button } from '@/shared/ui/primitives/button';

export function ProfileHeaderActions({ editing }: { editing: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      {editing ? (
        <>
          <Button
            asChild
            variant="ghost"
            className="h-10 rounded-full px-3 font-normal text-gitlog-danger hover:text-gitlog-danger"
          >
            <Link to="/mypage/settings">취소하기</Link>
          </Button>
          <Button
            type="submit"
            form="profile-settings"
            variant="ghost"
            className="h-10 rounded-full px-3 font-normal text-black"
          >
            저장하기
          </Button>
        </>
      ) : (
        <Button asChild variant="ghost" className="h-10 rounded-full px-3 font-normal text-black">
          <Link to="/mypage/settings/edit">수정하기</Link>
        </Button>
      )}
    </div>
  );
}
