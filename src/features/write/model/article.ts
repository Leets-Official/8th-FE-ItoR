export type ArticleImage = {
  id: string;
  src: string;
  alt: string;
};

export type ArticleTextBlock = {
  id: string;
  type: 'text';
  content: string;
};

export type ArticleImageBlock = {
  id: string;
  type: 'image';
  image: ArticleImage;
};

export type ArticleBlock = ArticleTextBlock | ArticleImageBlock;
