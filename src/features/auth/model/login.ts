import type { SignupMethod } from './signup';

export interface LoginCredentials {
  email: string;
  password: string;
}

export type LoginHandler = (method: SignupMethod, credentials?: LoginCredentials) => boolean;
