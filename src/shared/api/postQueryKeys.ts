export const postQueryKeys = {
  all: ['posts'] as const,
  main: (page: number, authenticated: boolean) =>
    [...postQueryKeys.all, 'main', page, authenticated] as const,
  my: (nickname: string | undefined) => [...postQueryKeys.all, 'my', nickname] as const,
  detailRoot: (postId: string) => ['post', postId] as const,
  detail: (postId: string, authenticatedUser: string | null) =>
    [...postQueryKeys.detailRoot(postId), authenticatedUser] as const,
};
