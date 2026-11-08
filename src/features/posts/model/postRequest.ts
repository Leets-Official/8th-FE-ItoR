import type { PostContentResponse } from './postResponse';

export interface PostWriteBody {
  title: string;
  contents: PostContentResponse[];
}
