import { useMutation, useQueryClient } from '@tanstack/react-query';

import { clearAuthSession, getAuthSnapshot, saveAuthTokens } from '@/shared/apis/tokenSession';
import { userQueryOptions } from '@/features/profile/api/useUserQuery';

import type { LoginCredentials } from '../model/login';
import { authApi } from './authApi';
import './authSession';

export function useLoginMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (body: LoginCredentials) => {
      const revision = getAuthSnapshot().revision;
      const { data } = await authApi.login(body);
      if (getAuthSnapshot().revision !== revision)
        throw new Error('로그인 상태가 변경되었습니다. 다시 시도해주세요.');
      await queryClient.cancelQueries();
      if (getAuthSnapshot().revision !== revision)
        throw new Error('로그인 상태가 변경되었습니다. 다시 시도해주세요.');
      queryClient.removeQueries();
      saveAuthTokens(data, 'email', true);
      const session = getAuthSnapshot();
      try {
        const user = await queryClient.fetchQuery(userQueryOptions(session));
        if (getAuthSnapshot().revision !== session.revision)
          throw new Error('로그인 상태가 변경되었습니다.');
        return user;
      } catch (error) {
        if (getAuthSnapshot().revision === session.revision) clearAuthSession();
        throw error;
      }
    },
    retry: false,
  });
}
