import type { OAuthRegisterRequiredResponse } from '@/shared/auth/model/auth';
import {
  isValidBirthDate,
  isValidEmail,
  isValidIntroduction,
  isValidName,
  isValidNickname,
  LAST_AVAILABLE_BIRTH_DATE,
} from '@/shared/utils/userValidation';

export type OAuthRegisterRequest = {
  email: string;
  nickname: string;
  profilePicture: string;
  birthDate: string;
  name: string;
  introduction: string;
  kakaoId: number;
};

export type KakaoRegistrationField = 'email' | 'name' | 'birthDate' | 'nickname' | 'introduction';

export function createInitialKakaoRegistrationValues(
  registration: OAuthRegisterRequiredResponse | null,
): OAuthRegisterRequest {
  return {
    email: '',
    nickname: '',
    profilePicture: registration?.picture ?? '',
    birthDate: '',
    name: registration?.nickname ?? '',
    introduction: '',
    kakaoId: registration?.kakaoId ?? 0,
  };
}

export function getKakaoRegistrationErrors(values: OAuthRegisterRequest) {
  const normalizedBirthDate = values.birthDate.replaceAll(' ', '');

  return {
    email: !isValidEmail(values.email),
    name: !isValidName(values.name),
    birthDate: !isValidBirthDate(normalizedBirthDate, LAST_AVAILABLE_BIRTH_DATE),
    nickname: !isValidNickname(values.nickname),
    introduction: !isValidIntroduction(values.introduction),
  };
}
