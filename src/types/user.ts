export type LoginProvider = 'EMAIL' | 'KAKAO';

export interface Author {
  id: number;
  nickname: string;
  profileImageUrl: string | null;
}

export interface User extends Author {
  email: string;
  name: string;
  birthDate: string;
  introduction: string;
  provider: LoginProvider;
}
