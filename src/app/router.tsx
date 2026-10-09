import { createBrowserRouter } from 'react-router';
import { BlogDetailPage } from '@/pages/BlogDetailPage';
import { BlogSearchPage } from '@/pages/BlogSearchPage';
import { KakaoCallbackPage } from '@/pages/KakaoCallbackPage';
import { KAKAO_CALLBACK_PATH } from '@/features/auth';
import { SignUpFormPage } from '@/pages/SignUpFormPage';
import { SignUpPage } from '@/pages/SignUpPage';
import { RootLayout } from './RootLayout';

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: '/', element: <BlogSearchPage /> },
      { path: '/posts/:postId', element: <BlogDetailPage /> },
      { path: '/signup', element: <SignUpPage /> },
      { path: '/signup/email', element: <SignUpFormPage /> },
      { path: '/signup/kakao', element: <SignUpFormPage provider="kakao" /> },
      { path: KAKAO_CALLBACK_PATH, element: <KakaoCallbackPage /> },
    ],
  },
]);
