import { isAxiosError } from 'axios';
import { api, type ApiResponse } from '@/shared/api/instance';
import { getAccessToken } from '@/shared/api/tokenStorage';
import { toPostComment, type CommentResponse } from '@/features/comment';
import type { PostContentBlock, PostCreateInput, PostDetail, PostSummary } from '../model/types';

// 서버는 본문을 순서 번호가 붙은 글·사진 조각으로 주고받는다. 글은 TEXT의 content, 사진은 IMAGE의 content(URL)
interface ContentDto {
  contentOrder: number;
  content: string;
  contentType: 'TEXT' | 'IMAGE';
}

interface PostSummaryResponse {
  postId: string;
  title: string;
  nickName: string;
  profileUrl?: string | null;
  createdAt: string;
  commentCount: number;
  contents: ContentDto[];
}

interface PostListResponse {
  posts: PostSummaryResponse[];
  // 전체 페이지 수
  pageMax: number;
}

interface PostDetailResponse extends Omit<PostSummaryResponse, 'commentCount'> {
  introduction?: string | null;
  // 토큰을 붙여 조회했을 때만 내 글인지 알려준다
  isOwner: boolean;
  comments: CommentResponse[];
}

export interface PostPage {
  posts: PostSummary[];
  pageCount: number;
}

// 서버가 조각을 순서대로 주지 않을 때가 있어 contentOrder로 정렬한다
function toContentBlocks(contents: ContentDto[]): PostContentBlock[] {
  return [...contents]
    .sort((a, b) => a.contentOrder - b.contentOrder)
    .map(({ content, contentType }) =>
      contentType === 'IMAGE'
        ? { type: 'image', imageUrl: content }
        : { type: 'text', text: content },
    );
}

function toContentDtos(content: PostContentBlock[]): ContentDto[] {
  return content.map((block, index) => ({
    contentOrder: index + 1,
    content: block.type === 'text' ? block.text : block.imageUrl,
    contentType: block.type === 'text' ? 'TEXT' : 'IMAGE',
  }));
}

// 목록에 보이는 요약(첫 글·첫 사진)을 본문에서 뽑는다
function summarizeContent(content: PostContentBlock[]) {
  const firstText = content.find((block) => block.type === 'text');
  const firstImage = content.find((block) => block.type === 'image');
  return { excerpt: firstText?.text ?? '', thumbnailUrl: firstImage?.imageUrl };
}

function toPostSummary({
  postId,
  title,
  nickName,
  profileUrl,
  createdAt,
  commentCount,
  contents,
}: PostSummaryResponse): PostSummary {
  return {
    id: postId,
    title,
    ...summarizeContent(toContentBlocks(contents)),
    author: { nickname: nickName, profileImageUrl: profileUrl || undefined },
    createdAt,
    commentCount,
  };
}

// page는 1부터 센다
export async function getPosts(page: number, size: number): Promise<PostPage> {
  const { data } = await api.get<ApiResponse<PostListResponse>>('/posts/all', {
    params: { page, size },
  });
  return { posts: data.data.posts.map(toPostSummary), pageCount: data.data.pageMax };
}

const ALL_POSTS_PAGE_SIZE = 100;

// 서버에 사용자별 글 목록 API가 없어, 모든 페이지를 받아 와서 화면에서 거른다
export async function getAllPosts(): Promise<PostSummary[]> {
  const firstPage = await getPosts(1, ALL_POSTS_PAGE_SIZE);
  const restPages = await Promise.all(
    Array.from({ length: Math.max(0, firstPage.pageCount - 1) }, (_, index) =>
      getPosts(index + 2, ALL_POSTS_PAGE_SIZE),
    ),
  );
  return [firstPage, ...restPages].flatMap(({ posts }) => posts);
}

// 없는 글이면 null. 로그인했으면 토큰이 필요한 API로 불러와야 내 글인지(isOwner) 알 수 있다
export async function getPostDetail(postId: string): Promise<PostDetail | null> {
  try {
    const { data } = await api.get<ApiResponse<PostDetailResponse>>(
      getAccessToken() ? '/posts/token' : '/posts',
      { params: { postId } },
    );
    const { introduction, isOwner, comments, contents, ...post } = data.data;
    const summary = toPostSummary({ ...post, contents, commentCount: comments.length });
    return {
      ...summary,
      author: { ...summary.author, introduction: introduction || undefined },
      content: toContentBlocks(contents),
      isOwner,
      comments: comments.map(toPostComment),
    };
  } catch (error) {
    // UUID 형식이 아닌 주소로 들어오면 서버가 500으로 응답해 이것도 없는 글로 본다
    if (isAxiosError(error) && [400, 404, 500].includes(error.response?.status ?? 0)) return null;
    throw error;
  }
}

interface CreatePostParams {
  input: PostCreateInput;
  // 작성 응답에 게시글 id가 없어 방금 쓴 글을 찾을 때 쓴다
  authorNickname: string;
}

// 최신 글 중 방금 쓴 내 글을 찾아 id를 돌려준다. 못 찾으면 undefined
export async function createPost({ input: { title, content }, authorNickname }: CreatePostParams) {
  await api.post('/posts', { title, contents: toContentDtos(content) });
  const { posts } = await getPosts(1, 10);
  return posts.find((post) => post.author.nickname === authorNickname && post.title === title)?.id;
}

interface UpdatePostParams {
  postId: string;
  input: PostCreateInput;
}

export async function updatePost({ postId, input: { title, content } }: UpdatePostParams) {
  await api.patch('/posts', { title, contents: toContentDtos(content) }, { params: { postId } });
}

export async function deletePost(postId: string) {
  await api.delete('/posts', { params: { postId } });
}
