import { useContext } from 'react';

import { ProfileEditContext } from '../model/profileEditContext';

/** @returns 프로필 편집 상태와 편집 시작·종료 함수 */
export function useProfileEditMode() {
  const context = useContext(ProfileEditContext);

  if (!context) {
    throw new Error('useProfileEditMode는 ProfileEditModeProvider 안에서 사용해야 합니다.');
  }

  return context;
}
