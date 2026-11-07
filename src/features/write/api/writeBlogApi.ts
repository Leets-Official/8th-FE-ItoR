import { apiClient } from '@/shared/api/apiClient';
import type { ApiResponse } from '@/shared/api/apiTypes';
import { getPostPage, type ContentDto } from '@/shared/api/postApi';

export type PostCreateRequest = {
  title: string;
  contents: ContentDto[];
};

export type PostUpdateRequest = PostCreateRequest;

const POST_ID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function isPostId(value: unknown): value is string {
  return typeof value === 'string' && POST_ID_PATTERN.test(value);
}

function getPostId(data: unknown) {
  if (isPostId(data)) {
    return data;
  }

  if (data && typeof data === 'object' && 'postId' in data) {
    const { postId } = data as { postId?: unknown };
    return isPostId(postId) ? postId : undefined;
  }

  return undefined;
}

function getPostIdFromLocation(location: string | undefined) {
  if (!location) {
    return undefined;
  }

  const locationUrl = new URL(location, window.location.origin);
  const queryPostId = locationUrl.searchParams.get('postId');
  const pathPostId = locationUrl.pathname.split('/').filter(Boolean).at(-1);
  return isPostId(queryPostId) ? queryPostId : isPostId(pathPostId) ? pathPostId : undefined;
}

function hasSameContents(responseContents: ContentDto[] | undefined, contents: ContentDto[]) {
  if (!responseContents || responseContents.length !== contents.length) {
    return false;
  }

  const orderedResponseContents = responseContents.toSorted(
    (firstContent, secondContent) => firstContent.contentOrder - secondContent.contentOrder,
  );

  return orderedResponseContents.every((responseContent, index) => {
    const requestContent = contents[index];
    return (
      responseContent.contentOrder === requestContent.contentOrder &&
      responseContent.content === requestContent.content &&
      responseContent.contentType === requestContent.contentType
    );
  });
}

async function findCreatedPostId(postCreateRequest: PostCreateRequest) {
  try {
    const response = await getPostPage({
      page: 1,
      size: 10,
      authenticated: true,
    });
    const createdPost = response.posts?.find(
      (post) =>
        post.title === postCreateRequest.title &&
        hasSameContents(post.contents, postCreateRequest.contents),
    );

    return createdPost?.postId;
  } catch {
    return undefined;
  }
}

/** 제목과 순서가 보존된 본문 블록으로 게시글을 생성하고 생성된 게시글 ID를 반환합니다. */
export async function postBlog(postCreateRequest: PostCreateRequest) {
  const response = await apiClient.post<ApiResponse<unknown>>('/posts', postCreateRequest, {
    timeout: 10_000,
  });
  const responsePostId =
    getPostId(response.data.data) || getPostIdFromLocation(response.headers.location);

  return responsePostId ?? findCreatedPostId(postCreateRequest);
}

/** 제목과 본문 블록 순서를 보존해 작성자 본인의 게시글을 수정합니다. */
export async function patchBlog(postId: string, postUpdateRequest: PostUpdateRequest) {
  await apiClient.patch<ApiResponse<void>>('/posts', postUpdateRequest, {
    params: { postId },
    timeout: 10_000,
  });
}
