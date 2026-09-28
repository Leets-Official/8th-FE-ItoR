import type { Author, User } from '@/types/user';

export const MOCK_CURRENT_USER: User = {
  id: 1,
  nickname: '수빈',
  profileImageUrl: null,
  email: 'soobin@example.com',
  name: '이수빈',
  birthDate: '2003-01-01',
  introduction: '프론트엔드를 공부하고 있어요.',
  provider: 'EMAIL',
};

export const MOCK_OTHER_AUTHOR: Author = {
  id: 2,
  nickname: '깃로거',
  profileImageUrl: null,
};
