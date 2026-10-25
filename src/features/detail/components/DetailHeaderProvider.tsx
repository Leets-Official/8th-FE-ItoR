import { useState, type ReactNode } from 'react';

import { DetailHeaderContext, type DetailHeaderState } from '../model/detailHeaderContext';

type DetailHeaderProviderProps = {
  children: ReactNode;
};

const INITIAL_DETAIL_HEADER_STATE: DetailHeaderState = {
  postId: '',
  isOwner: false,
};

/** 상세 데이터에 따라 전역 헤더의 게시글 소유자 동작을 제어합니다. */
export function DetailHeaderProvider({ children }: DetailHeaderProviderProps) {
  const [detailHeaderState, setDetailHeaderState] = useState(INITIAL_DETAIL_HEADER_STATE);

  return (
    <DetailHeaderContext.Provider value={{ ...detailHeaderState, setDetailHeaderState }}>
      {children}
    </DetailHeaderContext.Provider>
  );
}
