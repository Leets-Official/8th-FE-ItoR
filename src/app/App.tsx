import { lazy, Suspense } from 'react';

import { BrowserRouter, Route, Routes } from 'react-router';

import { AppLayout } from './layouts/AppLayout';

const ComponentGallery = lazy(() =>
  import('./ComponentGallery').then((module) => ({ default: module.ComponentGallery })),
);
const HomePage = lazy(() =>
  import('./routes/HomePage').then((module) => ({ default: module.HomePage })),
);
const PostWritePage = lazy(() =>
  import('./routes/PostWritePage').then((module) => ({ default: module.PostWritePage })),
);
const PostDetailsPage = lazy(() =>
  import('./routes/PostDetailsPage').then((module) => ({ default: module.PostDetailsPage })),
);
const SignupPage = lazy(() =>
  import('./routes/SignupPage').then((module) => ({ default: module.SignupPage })),
);
const SignupDetailsPage = lazy(() =>
  import('./routes/SignupDetailsPage').then((module) => ({ default: module.SignupDetailsPage })),
);

export function App() {
  return (
    <BrowserRouter>
      <Suspense
        fallback={
          <p role="status" className="p-8 text-center">
            화면을 불러오고 있습니다.
          </p>
        }
      >
        <Routes>
          <Route element={<AppLayout />}>
            <Route index element={<HomePage />} />
            <Route path="components" element={<ComponentGallery />} />
            <Route path="posts/new" element={<PostWritePage />} />
            <Route path="posts/:postId" element={<PostDetailsPage />} />
            <Route path="mypage/signup" element={<SignupPage />} />
            <Route path="mypage/signup/email" element={<SignupDetailsPage method="email" />} />
            <Route path="mypage/signup/kakao" element={<SignupDetailsPage method="kakao" />} />
            <Route
              path="*"
              element={
                <main className="p-8 text-center">
                  <h1>페이지를 찾을 수 없습니다.</h1>
                </main>
              }
            />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
