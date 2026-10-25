import { MY_POSTS_MOCK } from '@/features/my/mocks/posts.mock';
import { MY_PROFILE_MOCK } from '@/features/my/mocks/profile.mock';
import { MyPostListSection } from '@/features/my/sections/MyPostListSection';
import { MyProfileSection } from '@/features/my/sections/MyProfileSection';

/** @returns 프로필 정보와 작성한 블로그 목록을 조립한 마이 페이지 */
export default function MyPage() {
  return (
    <section className="flex h-fit w-full flex-col">
      <MyProfileSection
        nickname={MY_PROFILE_MOCK.nickname}
        introduction={MY_PROFILE_MOCK.introduction}
      />
      <MyPostListSection posts={MY_POSTS_MOCK} />
    </section>
  );
}
