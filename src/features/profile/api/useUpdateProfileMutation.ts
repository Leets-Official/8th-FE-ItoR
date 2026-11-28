import { useRef } from 'react';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { getAuthSnapshot } from '@/shared/apis/tokenSession';
import { getApiErrorMessage } from '@/shared/apis/response';
import { uploadImage } from '@/shared/apis/uploadImage';
import { postQueries } from '@/features/posts/api/postQueries';

import type { Profile, ProfileDraft } from '../model/profile';
import { createProfileChanges } from '../lib/createProfileChanges';
import { profileApi } from './profileApi';
import { profileQueries } from './profileQueries';
import { userQueryOptions } from './useUserQuery';

export function useUpdateProfileMutation() {
  const queryClient = useQueryClient();
  const uploadedPhoto = useRef<{ file: File; revision: number; url: string } | null>(null);
  return useMutation({
    mutationKey: [...profileQueries.all, 'update'],
    mutationFn: async ({
      profile,
      draft,
      photo,
    }: {
      profile: Profile;
      draft: ProfileDraft;
      photo?: File;
    }) => {
      const session = getAuthSnapshot();
      if (!session.hasSession) throw new Error('로그인이 필요합니다.');
      const { user, nickname, picture, password } = createProfileChanges(
        profile,
        photo ? { ...draft, avatarUrl: undefined } : draft,
      );
      let saved = 0;
      let refreshed = true;
      const sameSession = () =>
        getAuthSnapshot().hasSession && getAuthSnapshot().revision === session.revision;
      const requireSession = () => {
        if (!sameSession()) throw new Error('로그인 상태가 변경되었습니다. 다시 로그인해주세요.');
      };
      const run = async (operation: () => Promise<unknown>) => {
        requireSession();
        await operation();
        saved++;
        requireSession();
      };
      try {
        if (user) await run(() => profileApi.update(user));
        if (nickname) await run(() => profileApi.updateNickname(nickname));
        if (photo) {
          requireSession();
          // Retry a failed picture registration with the URL we already uploaded.
          let uploaded = uploadedPhoto.current;
          if (uploaded?.file !== photo || uploaded.revision !== session.revision) {
            uploaded = { file: photo, revision: session.revision, url: await uploadImage(photo) };
            uploadedPhoto.current = uploaded;
          }
          const { url } = uploaded;
          if (url !== profile.avatarUrl)
            await run(() => profileApi.updatePicture({ profilePicture: url }));
        } else if (picture) await run(() => profileApi.updatePicture(picture));
        if (password) await run(() => profileApi.updatePassword(password));
      } catch (error) {
        throw new Error(
          `${saved ? '일부 변경 사항은 저장되었습니다. ' : ''}${getApiErrorMessage(error)}`,
          { cause: error },
        );
      } finally {
        if (sameSession() && saved) {
          const key = profileQueries.me(session.revision);
          await queryClient.cancelQueries({ queryKey: key, exact: true });
          await queryClient.invalidateQueries({ queryKey: key, exact: true, refetchType: 'none' });
          try {
            if (sameSession()) await queryClient.fetchQuery(userQueryOptions(session));
          } catch {
            refreshed = false;
          }
          if (sameSession()) await queryClient.invalidateQueries({ queryKey: postQueries.all });
        }
      }
      requireSession();
      return { changed: saved > 0, refreshed };
    },
    retry: false,
  });
}
