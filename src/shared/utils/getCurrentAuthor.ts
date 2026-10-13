import type { User } from '@/shared/types/user';

export function getCurrentAuthor(id: string | undefined, users: readonly User[]): User | undefined {
  const user = users.find((item) => item.id === id);
  if (!user) return undefined;
  return {
    id: user.id,
    nickname: user.nickname,
    avatarUrl: user.avatarUrl,
    introduction: user.introduction,
  };
}
