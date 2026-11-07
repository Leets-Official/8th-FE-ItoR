import { useRegisterSW } from 'virtual:pwa-register/react';

import { ActionDialog } from '@/shared/ui/dialog/ActionDialog';

/** 새 버전이 준비되면 사용자의 확인을 받은 뒤 애플리케이션을 업데이트합니다. */
export function PwaUpdatePrompt() {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW();

  function postponeUpdate() {
    setNeedRefresh(false);
  }

  function updateApplication() {
    void updateServiceWorker(true);
  }

  if (!needRefresh) {
    return null;
  }

  return (
    <ActionDialog
      title="새로운 버전이 준비되었습니다."
      description="작성 중인 내용을 확인한 뒤 업데이트해주세요."
      cancelLabel="나중에"
      confirmLabel="업데이트"
      confirmVariant="point"
      onCancel={postponeUpdate}
      onConfirm={updateApplication}
    />
  );
}
