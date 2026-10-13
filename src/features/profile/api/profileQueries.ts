export const profileQueries = {
  all: ['profile'] as const,
  me: (revision: number) => ['profile', 'me', revision] as const,
};
