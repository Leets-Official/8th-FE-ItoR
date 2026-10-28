import type { Profile } from '@/features/profile/model/profile';

// shortcut: 가입 완료 상태를 재현하는 예시 계정. 인증 API 연결 시 서버 데이터로 교체한다.
export const MOCK_ACCOUNT = {
  password: '1111',
  profile: {
    id: 'preview-member',
    method: 'email',
    email: 'sd091415@naver.com',
    name: '홍준표',
    birthDate: '2002-04-03',
    nickname: '홍준표',
    introduction: '112131113',
  },
} satisfies { password: string; profile: Profile };
