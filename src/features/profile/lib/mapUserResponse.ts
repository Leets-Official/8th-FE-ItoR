import type { SignupMethod } from '@/features/auth/model/signup';

import type { Profile } from '../model/profile';
import type { UserResponse } from '../model/userResponse';

export function mapUserResponse(user: UserResponse, method: SignupMethod): Profile {
  return {
    id: String(user.id),
    email: user.email,
    nickname: user.nickname,
    name: user.name,
    birthDate: user.birthDate,
    avatarUrl: user.profilePicture ?? undefined,
    introduction: user.introduction ?? undefined,
    method,
  };
}
