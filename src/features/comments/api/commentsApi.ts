import { api } from '@/shared/apis/client';
import { isRecord, readApiResponse } from '@/shared/apis/response';

function isMutationData(value: unknown): value is Record<string, unknown> | null | undefined {
  return value == null || isRecord(value);
}

export const commentsApi = {
  create: async (postId: string, content: string) => {
    const response = await api.post<unknown>(`/comments/${encodeURIComponent(postId)}`, {
      content,
    });
    return readApiResponse(response.data, isMutationData);
  },
  update: async (commentId: number, content: string) => {
    const response = await api.patch<unknown>(`/comments/${commentId}`, { content });
    return readApiResponse(response.data, isMutationData);
  },
  delete: async (commentId: number) => {
    const response = await api.delete<unknown>(`/comments/${commentId}`);
    return readApiResponse(response.data, isMutationData);
  },
};
