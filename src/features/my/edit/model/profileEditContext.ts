import { createContext } from 'react';

type ProfileEditContextValue = {
  isEditing: boolean;
  startEditing: () => void;
  stopEditing: () => void;
};

export const ProfileEditContext = createContext<ProfileEditContextValue | null>(null);
