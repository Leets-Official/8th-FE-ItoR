import { useContext } from 'react';
import { SidebarContext } from './sidebarContext';

// 헤더의 메뉴(햄버거) 버튼에서 앱에 하나뿐인 사이드바를 연다
export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar는 SidebarContext.Provider 안에서만 사용할 수 있습니다.');
  }

  return context;
}
