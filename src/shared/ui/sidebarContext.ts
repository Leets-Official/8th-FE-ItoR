import { createContext } from 'react';

export interface SidebarContextValue {
  openSidebar: () => void;
}

export const SidebarContext = createContext<SidebarContextValue | null>(null);
