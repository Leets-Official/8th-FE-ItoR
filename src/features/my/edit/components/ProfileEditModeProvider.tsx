import { useState, type ReactNode } from 'react';

import { ProfileEditContext } from '../model/profileEditContext';

type ProfileEditModeProviderProps = {
  children: ReactNode;
};

/** @returns 프로필 수정 화면과 헤더가 공유하는 편집 상태 */
export function ProfileEditModeProvider({ children }: ProfileEditModeProviderProps) {
  const [isEditing, setIsEditing] = useState(false);

  function startEditing() {
    setIsEditing(true);
  }

  function stopEditing() {
    setIsEditing(false);
  }

  return (
    <ProfileEditContext value={{ isEditing, startEditing, stopEditing }}>
      {children}
    </ProfileEditContext>
  );
}
