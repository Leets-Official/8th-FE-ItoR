import type {
  PostAuthor,
  PostContentBlock,
  PostCreateInput,
  PostDetail,
  PostSummary,
} from '../model/types';
import blogDetailPhoto from '@/shared/assets/images/blog_detail_photo.svg';
import blogDetailText from '@/shared/assets/images/blog_detail_text.svg';
import blogPhoto from '@/shared/assets/images/blog_photo.svg';
import { countMockComments } from '@/features/comment';
import { MOCK_USERS } from '@/features/user';

const SHORT_EXCERPT = 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.';
const LONG_EXCERPT =
  "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.";
const SECOND_CONTENT_TEXT =
  'It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.';

// 시안의 목록 순서: (썸네일, 긴 요약) (썸네일, 짧은 요약) (없음, 긴 요약) (없음, 짧은 요약) (썸네일, 짧은 요약)
const PATTERN = [
  { hasThumbnail: true, excerpt: LONG_EXCERPT },
  { hasThumbnail: true, excerpt: SHORT_EXCERPT },
  { hasThumbnail: false, excerpt: LONG_EXCERPT },
  { hasThumbnail: false, excerpt: SHORT_EXCERPT },
  { hasThumbnail: true, excerpt: SHORT_EXCERPT },
];

// API 연동 전까지 쓰는 목업. 댓글 수는 읽을 때 댓글 저장소에서 세므로 여기서는 0으로 둔다
const MOCK_POSTS: PostSummary[] = Array.from({ length: 25 }, (_, index) => {
  const id = index + 1;
  const { hasThumbnail, excerpt } = PATTERN[index % PATTERN.length];

  return {
    id,
    title: '32 Title one line',
    excerpt,
    // 사용자 페이지에서 다른 사람의 글 목록을 볼 수 있게 작성자를 번갈아 넣는다
    author: MOCK_USERS[index % MOCK_USERS.length],
    createdAt: new Date(2025, 1, 17).toISOString(),
    commentCount: 0,
    thumbnailUrl: hasThumbnail ? blogPhoto : undefined,
  };
});

// 시안의 본문 순서: 글 → 사진 → 글 → 사진
const createMockContent = (): PostContentBlock[] => [
  { type: 'text', text: LONG_EXCERPT },
  { type: 'image', imageUrl: blogDetailText },
  { type: 'text', text: SECOND_CONTENT_TEXT },
  { type: 'image', imageUrl: blogDetailPhoto },
];

// 글쓰기·수정으로 저장한 본문. 목업 글은 모두 같은 본문을 쓰므로 저장한 글만 따로 보관한다
const CREATED_POST_CONTENTS = new Map<number, PostContentBlock[]>();

// 서버가 게시글을 내려줄 때처럼 그 시점의 댓글 수를 채운다. 댓글 등록·삭제가 목록에도 반영된다
function withCommentCount(post: PostSummary): PostSummary {
  return { ...post, commentCount: countMockComments(post.id) };
}

// API 연동 후 게시글 목록 요청 함수로 바꿉니다
export function getMockPosts(): PostSummary[] {
  return MOCK_POSTS.map(withCommentCount);
}

// API 연동 후 게시글 상세 요청 함수로 바꿉니다
export function getMockPostDetail(postId: number): PostDetail | undefined {
  const post = MOCK_POSTS.find(({ id }) => id === postId);
  return (
    post && {
      ...withCommentCount(post),
      content: CREATED_POST_CONTENTS.get(postId) ?? createMockContent(),
    }
  );
}

// 목록에 보이는 요약(첫 글·첫 사진)을 본문에서 뽑는다
function summarizeContent(content: PostContentBlock[]) {
  const firstText = content.find((block) => block.type === 'text');
  const firstImage = content.find((block) => block.type === 'image');
  return { excerpt: firstText?.text ?? '', thumbnailUrl: firstImage?.imageUrl };
}

// API 연동 후 게시글 작성 요청 함수로 바꿉니다. 새로고침하면 사라진다
export function createMockPost({ title, content }: PostCreateInput, author: PostAuthor) {
  const id = Math.max(0, ...MOCK_POSTS.map((post) => post.id)) + 1;

  // 목록은 최신 글이 위에 오도록 맨 앞에 넣는다
  MOCK_POSTS.unshift({
    id,
    title,
    ...summarizeContent(content),
    author,
    createdAt: new Date().toISOString(),
    commentCount: 0,
  });
  CREATED_POST_CONTENTS.set(id, content);
  return id;
}

// API 연동 후 게시글 수정 요청 함수로 바꿉니다. 작성자·작성일은 그대로 둔다
export function updateMockPost(postId: number, { title, content }: PostCreateInput) {
  const post = MOCK_POSTS.find(({ id }) => id === postId);
  if (!post) return;

  Object.assign(post, { title, ...summarizeContent(content) });
  CREATED_POST_CONTENTS.set(postId, content);
}

// API 연동 후 게시글 삭제 요청 함수로 바꿉니다
export function deleteMockPost(postId: number) {
  const index = MOCK_POSTS.findIndex(({ id }) => id === postId);
  if (index !== -1) MOCK_POSTS.splice(index, 1);
  CREATED_POST_CONTENTS.delete(postId);
}
