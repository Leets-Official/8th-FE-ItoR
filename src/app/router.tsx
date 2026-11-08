import { createBrowserRouter } from 'react-router';
import { BlogSearchPage } from '@/pages/BlogSearchPage';
import { KAKAO_CALLBACK_PATH } from '@/features/auth';
import { RootLayout } from './RootLayout';

// 첫 화면(/)만 메인 번들에 넣고 나머지 페이지는 들어갈 때 따로 받아 첫 로딩 JS를 줄인다
export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: '/', element: <BlogSearchPage /> },
      {
        path: '/posts/:postId',
        lazy: () => import('@/pages/BlogDetailPage').then((m) => ({ Component: m.BlogDetailPage })),
      },
      {
        path: '/write',
        lazy: () => import('@/pages/PostWritePage').then((m) => ({ Component: m.PostWritePage })),
      },
      {
        path: '/posts/:postId/edit',
        lazy: () => import('@/pages/PostWritePage').then((m) => ({ Component: m.PostWritePage })),
      },
      {
        path: '/users/:nickname',
        lazy: () => import('@/pages/UserBlogPage').then((m) => ({ Component: m.UserBlogPage })),
      },
      {
        path: '/profile',
        lazy: () => import('@/pages/ProfilePage').then((m) => ({ Component: m.ProfilePage })),
      },
      {
        path: '/signup',
        lazy: () => import('@/pages/SignUpPage').then((m) => ({ Component: m.SignUpPage })),
      },
      {
        path: '/signup/email',
        lazy: () => import('@/pages/SignUpFormPage').then((m) => ({ Component: m.SignUpFormPage })),
      },
      {
        path: '/signup/kakao',
        // provider prop을 넘겨야 해서 Component 대신 element로 돌려준다
        lazy: () =>
          import('@/pages/SignUpFormPage').then((m) => ({
            element: <m.SignUpFormPage provider="kakao" />,
          })),
      },
      {
        path: KAKAO_CALLBACK_PATH,
        lazy: () =>
          import('@/pages/KakaoCallbackPage').then((m) => ({ Component: m.KakaoCallbackPage })),
      },
    ],
  },
]);
