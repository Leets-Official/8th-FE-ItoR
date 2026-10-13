import { useQuery } from '@tanstack/react-query';

import { getAuthSnapshot } from '@/shared/apis/tokenSession';

import { mapUserResponse } from '../lib/mapUserResponse';
import { profileApi } from './profileApi';
import { profileQueries } from './profileQueries';

export function userQueryOptions(session: ReturnType<typeof getAuthSnapshot>) {
  return {
    queryKey: profileQueries.me(session.revision),
    queryFn: async ({ signal }: { signal: AbortSignal }) => {
      const { data } = await profileApi.getMe(signal);
      return mapUserResponse(data, session.method);
    },
    retry: false,
    staleTime: 60_000,
    meta: { requiresAuth: true },
  };
}

export function useUserQuery(session: ReturnType<typeof getAuthSnapshot>) {
  return useQuery({ ...userQueryOptions(session), enabled: session.hasSession });
}
