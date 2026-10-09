export type SignupMethod = 'email' | 'kakao';

export interface SignupValues {
  email: string;
  password: string;
  passwordConfirmation: string;
  name: string;
  birthDate: string;
  nickname: string;
  introduction: string;
}

export type SignupFieldName = keyof SignupValues;
export type SignupErrors = Partial<Record<SignupFieldName, string>>;
