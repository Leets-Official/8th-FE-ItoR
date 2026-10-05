export type ArticleImage = {
  id: string;
  src: string;
  alt: string;
};

export type DetailPost = {
  title: string;
  body: string;
  nickname: string;
  createdAt: string;
  commentCount: number;
  images: readonly ArticleImage[];
};

export type DetailComment = {
  id: string;
  nickname: string;
  date: string;
  content: string;
  isOwned: boolean;
};

export type DetailAuthor = {
  nickname: string;
  introduction: string;
};

export type DetailViewer = {
  nickname: string;
};
