import type { User } from '@/features/user';

export interface AuthUser extends User {
  email: string;
}
