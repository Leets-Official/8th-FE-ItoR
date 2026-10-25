import { useNavigate } from '@tanstack/react-router';

import { useAuth } from '@/shared/auth/hooks/useAuth';
import { clearPendingKakaoRegistration } from '@/shared/auth/model/pendingKakaoRegistration';
import { ActionDialog } from '@/shared/ui/dialog/ActionDialog';

/** 카카오 미가입 계정에 회원가입 이동 여부를 묻는 대화상자입니다. */
export function KakaoRegistrationDialog() {
  const navigate = useNavigate();
  const { isKakaoRegistrationRequired, dismissKakaoRegistration } = useAuth();

  function closeDialog() {
    clearPendingKakaoRegistration();
    dismissKakaoRegistration();
  }

  async function moveToRegisterPage() {
    closeDialog();
    await navigate({ to: '/register' });
  }

  if (!isKakaoRegistrationRequired) {
    return null;
  }

  return (
    <ActionDialog
      title="가입되지 않은 계정이에요."
      description="회원가입을 진행할까요?"
      cancelLabel="취소"
      confirmLabel="회원가입 하기"
      confirmVariant="point"
      onCancel={closeDialog}
      onConfirm={moveToRegisterPage}
    />
  );
}
