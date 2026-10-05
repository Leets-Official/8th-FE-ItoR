import { Outlet } from '@tanstack/react-router';

import { AppHeader } from '@/app/layout/components/AppHeader';
import { ProfileEditModeProvider } from '@/features/my/edit/components/ProfileEditModeProvider';
import { ToastProvider } from '@/shared/ui/toast/ToastProvider';

export default function MainLayout() {
  return (
    <ToastProvider>
      <ProfileEditModeProvider>
        <div className="flex min-h-dvh w-full flex-col bg-white">
          <div className="sticky top-0 z-50 w-full shrink-0">
            <AppHeader />
          </div>

          <main className="flex w-full flex-1 flex-col">
            <Outlet />
          </main>
        </div>
      </ProfileEditModeProvider>
    </ToastProvider>
  );
}
