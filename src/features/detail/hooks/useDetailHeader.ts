import { useContext } from 'react';

import { DetailHeaderContext } from '../model/detailHeaderContext';

export function useDetailHeader() {
  const context = useContext(DetailHeaderContext);

  if (!context) {
    throw new Error('useDetailHeader는 DetailHeaderProvider 내부에서 사용해야 합니다.');
  }

  return context;
}
