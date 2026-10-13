import type { Post } from './post';

const LONG_SUMMARY =
  "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. Mapper가 어떻게 작동하는지부터 다시 되짚어보며 문제를 해결해봤다.";
const SHORT_SUMMARY = 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.';
const now = Date.now();

// ponytail: API 연결 전 목록·상세 미리보기 데이터. 게시물 조회 API가 준비되면 교체한다.
export const previewPosts: Post[] = Array.from({ length: 43 }, (_, index) => ({
  id: String(index + 1),
  title: index === 0 ? '16 Title one line' : `16 Title one line · ${index + 1}`,
  subtitle: index === 1 ? 'subtitle one line' : undefined,
  summary: index % 4 === 0 || index % 4 === 2 ? LONG_SUMMARY : SHORT_SUMMARY,
  content: [
    {
      type: 'text',
      text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
    },
    {
      type: 'image',
      src: 'https://placehold.co/656x137/png',
      alt: '본문의 가로형 샘플 이미지',
      width: 656,
      height: 137,
    },
    {
      type: 'text',
      text: 'It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
    },
    {
      type: 'image',
      src: 'https://placehold.co/656x657/png',
      alt: '본문의 정사각형 샘플 이미지',
      width: 656,
      height: 657,
    },
  ],
  author: { nickname: '닉네임', introduction: '한 줄 소개' },
  publishedAt: new Date(
    now - (index === 0 ? 13 : index === 1 ? 23 : 24 + (index - 2) * 24) * 3600000,
  ).toISOString(),
  commentCount: 0,
  thumbnailUrl: [0, 1, 4].includes(index % 5) ? 'https://placehold.co/92x92/png' : undefined,
}));
