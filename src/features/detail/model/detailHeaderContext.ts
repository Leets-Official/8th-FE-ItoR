import { createContext } from 'react';

export type DetailHeaderState = {
  postId: string;
  isOwner: boolean;
};

export type DetailHeaderContextValue = DetailHeaderState & {
  setDetailHeaderState: (detailHeaderState: DetailHeaderState) => void;
};

export const DetailHeaderContext = createContext<DetailHeaderContextValue | null>(null);
