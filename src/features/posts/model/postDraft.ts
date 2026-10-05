import type { PostContentBlock } from './post';

export type PostDraftBlock = PostContentBlock & { id: string };

export interface PostDraft {
  title: string;
  blocks: PostDraftBlock[];
}
