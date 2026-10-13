import { useNavigate, useOutletContext } from 'react-router';

import type { ProfileDraft } from '@/features/profile/model/profile';
import { ProfileSettingsForm } from '@/features/profile/ui/ProfileSettingsForm';
import { GitlogButton } from '@/shared/ui/GitlogButton';
import { notify } from '@/shared/ui/StatusToast';

import type { AppLayoutContext } from '../layouts/AppLayout';

export function ProfileSettingsPage({ editing = false }: { editing?: boolean }) {
  const { previewUser, updateProfile, openLogin } = useOutletContext<AppLayoutContext>();
  const navigate = useNavigate();
  if (!previewUser)
    return (
      <main className="p-8 text-center font-auth">
        <h1>로그인이 필요합니다.</h1>
        <GitlogButton onClick={openLogin} className="mt-4">
          로그인하기
        </GitlogButton>
      </main>
    );
  function save(draft: ProfileDraft) {
    if (!updateProfile(draft)) {
      notify.error('프로필 변경 기능은 준비 중입니다. 아직 변경 내용을 저장할 수 없습니다.');
      return;
    }
    navigate('/?view=mine');
    notify.success('저장되었습니다!');
  }
  return (
    <main className="font-auth">
      <h1 className="sr-only">{editing ? '내 프로필 수정' : '내 프로필 설정'}</h1>
      <ProfileSettingsForm
        key={`${previewUser.id}-${editing}`}
        profile={previewUser}
        editing={editing}
        onSave={save}
      />
    </main>
  );
}
