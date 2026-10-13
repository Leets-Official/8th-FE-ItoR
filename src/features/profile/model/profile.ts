import type { SignupMethod, SignupValues } from '@/features/auth/model/signup';
import type { User } from '@/shared/types/user';

export interface Profile extends User {
  method: SignupMethod;
  email: string;
  name: string;
  birthDate: string;
}

export interface ProfileDraft extends SignupValues {
  avatarUrl?: string;
}
