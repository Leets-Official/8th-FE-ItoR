import type { ComponentType } from 'react';
import { createBrowserRouter } from 'react-router';
import LoginRequired from '@/components/auth/LoginRequired';
import Spinner from '@/components/common/Spinner';
import RootLayout from '@/components/layout/RootLayout';
import MainPage from '@/pages/MainPage';

/** 페이지 파일을 이동하는 시점에 불러온다. (Dynamic Import + Lazy Loading) */
const lazyPage = (importPage: () => Promise<{ default: ComponentType }>) => async () => ({
  Component: (await importPage()).default,
});

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    hydrateFallbackElement: <Spinner />,
    children: [
      // 첫 화면인 메인 페이지는 바로 보여야 하므로 처음부터 번들에 포함한다.
      { path: '/', element: <MainPage /> },
      { path: '/posts/:postId', lazy: lazyPage(() => import('@/pages/PostDetailPage')) },
      { path: '/signup', lazy: lazyPage(() => import('@/pages/SignupPage')) },
      { path: '/signup/form', lazy: lazyPage(() => import('@/pages/SignupFormPage')) },
      {
        // 아래 페이지들은 로그인한 사용자만 볼 수 있다.
        element: <LoginRequired />,
        children: [
          { path: '/write', lazy: lazyPage(() => import('@/pages/PostWritePage')) },
          { path: '/posts/:postId/edit', lazy: lazyPage(() => import('@/pages/PostWritePage')) },
          { path: '/my', lazy: lazyPage(() => import('@/pages/MyBlogPage')) },
          { path: '/settings', lazy: lazyPage(() => import('@/pages/ProfileSettingsPage')) },
        ],
      },
      { path: '*', lazy: lazyPage(() => import('@/pages/NotFoundPage')) },
    ],
  },
]);
