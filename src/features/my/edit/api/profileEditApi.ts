import { uploadImage } from '@/shared/api/imageUpload';

import { patchNickname, patchPassword, patchProfilePicture, patchUser } from '../../api/userApi';
import type { ProfileEditValues } from '../model/profileEditForm';

type SaveProfileInput = {
  values: ProfileEditValues;
  savedValues: ProfileEditValues;
  profilePicture: string;
  savedProfilePicture: string;
  profileImageFile: File | null;
};

/** 변경된 프로필 필드만 서버에 저장하고 최종 프로필 사진 URL을 반환합니다. */
export async function saveProfile({
  values,
  savedValues,
  profilePicture,
  savedProfilePicture,
  profileImageFile,
}: SaveProfileInput) {
  const nextProfilePicture = profileImageFile
    ? await uploadImage(profileImageFile)
    : profilePicture;
  const hasGeneralProfileChange =
    values.introduction !== savedValues.introduction || values.birthDate !== savedValues.birthDate;
  const requests: Promise<void>[] = [];

  if (hasGeneralProfileChange) {
    requests.push(
      patchUser({
        email: values.email,
        nickname: values.nickname,
        profilePicture: nextProfilePicture,
        birthDate: values.birthDate,
        name: values.name,
        introduction: values.introduction,
      }),
    );
  } else {
    if (values.nickname !== savedValues.nickname) {
      requests.push(patchNickname({ nickname: values.nickname }));
    }

    if (nextProfilePicture !== savedProfilePicture) {
      requests.push(patchProfilePicture({ profilePicture: nextProfilePicture }));
    }
  }

  if (values.password) {
    requests.push(patchPassword({ password: values.password }));
  }

  await Promise.all(requests);
  return nextProfilePicture;
}
