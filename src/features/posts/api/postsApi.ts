import { api } from '@/shared/apis/client';
import { isRecord, readApiResponse } from '@/shared/apis/response';

import type { PostWriteBody } from '../model/postRequest';
import type {
  PostContentResponse,
  PostDetailResponse,
  PostListParams,
  PostListResponse,
} from '../model/postResponse';

function isOptionalString(value: unknown) {
  return value == null || typeof value === 'string';
}

function isContents(value: unknown): value is PostContentResponse[] {
  return (
    Array.isArray(value) &&
    value.every(
      (item) =>
        isRecord(item) &&
        Number.isSafeInteger(item.contentOrder) &&
        typeof item.content === 'string' &&
        (item.contentType === 'TEXT' || item.contentType === 'IMAGE'),
    )
  );
}

function isPostFields(value: unknown): value is Record<string, unknown> {
  return (
    isRecord(value) &&
    typeof value.postId === 'string' &&
    Boolean(value.postId) &&
    typeof value.title === 'string' &&
    typeof value.nickName === 'string' &&
    isOptionalString(value.profileUrl) &&
    typeof value.createdAt === 'string' &&
    isContents(value.contents)
  );
}

function isPostList(value: unknown): value is PostListResponse {
  return (
    isRecord(value) &&
    typeof value.pageMax === 'number' &&
    Number.isSafeInteger(value.pageMax) &&
    value.pageMax >= 0 &&
    Array.isArray(value.posts) &&
    value.posts.every(
      (post) =>
        isPostFields(post) &&
        typeof post.commentCount === 'number' &&
        Number.isSafeInteger(post.commentCount) &&
        post.commentCount >= 0,
    )
  );
}

function isPostDetail(value: unknown): value is PostDetailResponse {
  return (
    isPostFields(value) &&
    typeof value.isOwner === 'boolean' &&
    isOptionalString(value.introduction) &&
    Array.isArray(value.comments) &&
    value.comments.every(
      (comment) =>
        isRecord(comment) &&
        Number.isSafeInteger(comment.commentId) &&
        typeof comment.content === 'string' &&
        typeof comment.nickName === 'string' &&
        isOptionalString(comment.profileUrl) &&
        typeof comment.createdAt === 'string' &&
        typeof comment.isOwner === 'boolean',
    )
  );
}

function isMutationData(value: unknown): value is Record<string, unknown> | null | undefined {
  return value == null || isRecord(value);
}

export const postsApi = {
  create: async (body: PostWriteBody) => {
    const response = await api.post<unknown>('/posts', body);
    return readApiResponse(response.data, isMutationData);
  },
  update: async (postId: string, body: PostWriteBody) => {
    const response = await api.patch<unknown>('/posts', body, { params: { postId } });
    return readApiResponse(response.data, isMutationData);
  },
  delete: async (postId: string) => {
    const response = await api.delete<unknown>('/posts', { params: { postId } });
    return readApiResponse(response.data, isMutationData);
  },
  getList: async (params: PostListParams, authenticated: boolean, signal?: AbortSignal) => {
    const response = await api.get<unknown>(authenticated ? '/posts/all/token' : '/posts/all', {
      params,
      signal,
      headers: authenticated ? undefined : { Authorization: false },
    });
    return readApiResponse(response.data, isPostList);
  },
  getDetail: async (postId: string, authenticated: boolean, signal?: AbortSignal) => {
    const response = await api.get<unknown>(authenticated ? '/posts/token' : '/posts', {
      params: { postId },
      signal,
      headers: authenticated ? undefined : { Authorization: false },
    });
    return readApiResponse(response.data, isPostDetail);
  },
};
