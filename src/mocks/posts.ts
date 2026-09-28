import type { PostDetail, PostSummary } from '@/types/post';
import { MOCK_CURRENT_USER, MOCK_OTHER_AUTHOR } from './users';

const LONG_PREVIEW =
  "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.";
const SHORT_PREVIEW = 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.';
const THUMBNAILS = ['/images/sample-1.svg', '/images/sample-2.svg', '/images/sample-3.svg'];

const TOTAL_MOCK_POSTS = 23;

export const MOCK_POSTS: PostSummary[] = Array.from({ length: TOTAL_MOCK_POSTS }, (_, index) => {
  const id = TOTAL_MOCK_POSTS - index;
  const hasThumbnail = index % 3 !== 2;

  return {
    id,
    title: `${id}번째 깃로그 제목`,
    preview: index % 2 === 0 ? LONG_PREVIEW : SHORT_PREVIEW,
    thumbnailUrl: hasThumbnail ? THUMBNAILS[index % THUMBNAILS.length] : null,
    author: index % 4 === 0 ? MOCK_CURRENT_USER : MOCK_OTHER_AUTHOR,
    createdAt: new Date(2025, 1, 17 - (index % 10)).toISOString(),
    commentCount: index % 5,
  };
});

const CODE_SAMPLE = `@Mapper
public interface TestMapper {
    void updateHuman(TestDto testDto, @MappingTarget Test test);
}`;

export const getMockPostDetail = (postId: number): PostDetail | null => {
  const summary = MOCK_POSTS.find((post) => post.id === postId);
  if (!summary) return null;

  const { preview, thumbnailUrl, ...rest } = summary;

  return {
    ...rest,
    contents: [
      { contentOrder: 1, type: 'TEXT', value: preview },
      { contentOrder: 2, type: 'CODE', value: CODE_SAMPLE },
      ...(thumbnailUrl ? [{ contentOrder: 3, type: 'IMAGE' as const, value: thumbnailUrl }] : []),
      {
        contentOrder: 4,
        type: 'TEXT',
        value:
          'It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
      },
    ],
  };
};
