import type { ReactNode } from 'react';
import Avatar from '@/components/common/Avatar';

interface ProfileSummaryProps {
  nickname: string;
  introduction?: string;
  profileImageUrl: string | null;
  /** 프로필 아래에 추가로 보여줄 버튼 (예: 내 프로필 설정) */
  action?: ReactNode;
}

function ProfileSummary({ nickname, introduction, profileImageUrl, action }: ProfileSummaryProps) {
  return (
    <div className="flex flex-col items-start gap-4">
      <Avatar src={profileImageUrl} alt={`${nickname}의 프로필 사진`} size="lg" />
      <div>
        <p className="text-2xl text-ink">{nickname}</p>
        {introduction && <p className="mt-2 text-sm text-gray-600">{introduction}</p>}
      </div>
      {action}
    </div>
  );
}

export default ProfileSummary;
