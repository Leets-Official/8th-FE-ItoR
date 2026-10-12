import type { ReactNode } from 'react';
import defaultProfile from '@/shared/assets/images/profile_64.svg';
import { cn } from '@/shared/lib/utils';
import type { User } from '../model/types';

interface UserProfileProps {
  user: User & { introduction?: string };
  // 소개 아래에 붙는 행동 버튼 (예: 마이페이지의 내 프로필 설정)
  children?: ReactNode;
  className?: string;
}

// 게시글 상세 하단의 작성자 정보, 마이페이지 상단의 내 정보에 쓰는 프로필 (사진·닉네임·한 줄 소개)
export function UserProfile({ user, children, className }: UserProfileProps) {
  const { nickname, introduction, profileImageUrl } = user;

  return (
    <div className={cn('flex w-full flex-col', className)}>
      <div className="px-4 py-3">
        <img
          src={profileImageUrl ?? defaultProfile}
          alt=""
          width={64}
          height={64}
          className="size-16 rounded-full object-cover"
        />
      </div>
      <div className="flex flex-col gap-3 px-4 py-3">
        <p className="text-24 font-medium text-black">{nickname}</p>
        {introduction && <p className="text-14 font-light text-gray-20">{introduction}</p>}
      </div>
      {children && <div className="flex px-4 py-3">{children}</div>}
    </div>
  );
}
