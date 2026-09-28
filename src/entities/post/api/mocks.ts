import type { PostContentBlock, PostDetail, PostSummary } from '../model/types';
import blogPhoto from '@/shared/assets/images/blog_photo.svg';

const SHORT_EXCERPT = 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.';
const LONG_EXCERPT =
  "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.";

// 시안의 목록 순서: (썸네일, 긴 요약) (썸네일, 짧은 요약) (없음, 긴 요약) (없음, 짧은 요약) (썸네일, 짧은 요약)
const PATTERN = [
  { hasThumbnail: true, excerpt: LONG_EXCERPT },
  { hasThumbnail: true, excerpt: SHORT_EXCERPT },
  { hasThumbnail: false, excerpt: LONG_EXCERPT },
  { hasThumbnail: false, excerpt: SHORT_EXCERPT },
  { hasThumbnail: true, excerpt: SHORT_EXCERPT },
];

// API 연동 전까지 쓰는 목업
export const MOCK_POSTS: PostSummary[] = Array.from({ length: 25 }, (_, index) => {
  const id = index + 1;
  const { hasThumbnail, excerpt } = PATTERN[index % PATTERN.length];

  return {
    id,
    title: '16 Title one line',
    excerpt,
    author: { nickname: '닉네임', introduction: '한 줄 소개' },
    createdAt: new Date(2025, 1, 17).toISOString(),
    commentCount: 0,
    thumbnailUrl: hasThumbnail ? blogPhoto : undefined,
  };
});

// 시안의 본문 순서: 글 → 사진 → 글 → 사진
const createMockContent = (): PostContentBlock[] => [
  { type: 'text', text: LONG_EXCERPT },
  { type: 'image', imageUrl: blogPhoto },
  { type: 'text', text: SHORT_EXCERPT },
  { type: 'image', imageUrl: blogPhoto },
];

// API 연동 후 게시글 상세 요청 함수로 바꿉니다
export function getMockPostDetail(postId: number): PostDetail | undefined {
  const post = MOCK_POSTS.find(({ id }) => id === postId);
  return post && { ...post, content: createMockContent() };
}
