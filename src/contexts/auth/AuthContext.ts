import { createContext } from 'react';
import type { User } from '@/types/user';

export interface AuthContextValue {
  user: User | null;
  isLoggedIn: boolean;
  login: () => void;
  logout: () => void;
  updateUser: (changes: Partial<User>) => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
