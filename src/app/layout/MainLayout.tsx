import { Outlet } from '@tanstack/react-router';

import { AuthProvider } from '@/shared/auth/components/AuthProvider';
import { QueryProvider } from '@/shared/api/QueryProvider';
import { AppHeader } from '@/app/layout/components/AppHeader';
import { PwaUpdatePrompt } from '@/app/pwa/PwaUpdatePrompt';
import { DetailHeaderProvider } from '@/features/detail/components/DetailHeaderProvider';
import { ProfileEditModeProvider } from '@/features/my/edit/components/ProfileEditModeProvider';
import { ToastProvider } from '@/shared/ui/toast/ToastProvider';

export default function MainLayout() {
  return (
    <QueryProvider>
      <ToastProvider>
        <PwaUpdatePrompt />
        <AuthProvider>
          <DetailHeaderProvider>
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
          </DetailHeaderProvider>
        </AuthProvider>
      </ToastProvider>
    </QueryProvider>
  );
}
