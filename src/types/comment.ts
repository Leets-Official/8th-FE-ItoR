import type { Author } from './user';

export interface Comment {
  id: number;
  content: string;
  author: Author;
  createdAt: string;
}
