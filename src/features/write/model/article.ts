export type ArticleImage = {
  id: string;
  src: string;
  alt: string;
  file?: File;
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
