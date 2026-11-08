---
paths:
  - 'src/**/api/**/*'
  - 'src/app/**/*'
  - '.env*'
---

# API 연동

## 기본 axios 인스턴스

[src/shared/api/instance.ts](../../src/shared/api/instance.ts)에 공용 axios 인스턴스가 구성되어 있습니다.

```ts
import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});
```

- `baseURL`은 `VITE_API_BASE_URL` 환경 변수로 주입됩니다. 로컬 개발 시 프로젝트 루트에 `.env`(`.gitignore`에 포함되어 커밋되지 않음)를 만들고 값을 설정하세요.
- 카카오 로그인·회원가입은 서버의 `GET /auth/kakao`로 페이지를 이동시킵니다. 이 API는 JSON 대신 302로 카카오 로그인 화면에 보내므로 axios로 부르지 않고 `window.location.assign`을 씁니다. 카카오는 서버가 정한 redirect_uri `http://localhost:3000/oauth/kakao/success`로 돌아오므로 개발 서버는 3000번 포트(`vite.config.ts`)에서 띄웁니다. 인가 URL에 `state`가 없어 돌아갈 경로는 `sessionStorage`에 저장합니다. ([kakaoAuth.ts](../../src/features/auth/api/kakaoAuth.ts))
- 서버 응답은 `{ code, message, data }`로 감싸 오므로 `ApiResponse<T>`(instance.ts)로 타입을 지정합니다.
- 로그인하면 액세스·리프레시 토큰을 `sessionStorage`의 한 항목에 함께 저장하고([tokenStorage.ts](../../src/shared/api/tokenStorage.ts), 저장에 실패하면 `saveTokens`가 던져 로그인·재발급이 실패로 끝납니다), 요청 인터셉터가 인증이 필요한 백엔드 요청에 `Authorization: Bearer` 헤더를 붙입니다. 로그인·회원가입(`/auth/*`), 외부 URL, 요청 설정에 `isPublic: true`를 넘긴 공개 API(게시글 목록·비로그인 상세 등)는 제외합니다. 비로그인으로도 부를 수 있는 API를 추가하면 호출하는 쪽에서 `isPublic: true`를 넘깁니다. 로그아웃하면 토큰을 지웁니다.
- 인증 요청 전에 액세스 토큰이 없거나 JWT 만료까지 30초 이내이면 리프레시 토큰으로 `POST /auth/reissue`를 보냅니다. JWT 형식을 읽을 수 없거나 숫자 `exp`가 없어도 재발급하며, 실패하면 원래 요청을 보내지 않고 `code`가 `SESSION_EXPIRED_ERROR_CODE`(`'ERR_SESSION_EXPIRED'`)인 `AxiosError`로 실패시킵니다. 서버 4xx 응답(`ERR_BAD_REQUEST`)과 구분할 때 이 코드를 봅니다. 사용자 Context가 아닌 토큰 저장소로 판단하므로 로그인 직후 `/users/me` 조회도 처리합니다.
- 서버의 인증 실패는 응답 인터셉터에서 재발급 후 한 번 재시도합니다. HTTP 401, 200 + 본문 `code: 401`, HTTP 500 + `message: 'JWT expired …'`를 처리합니다. 요청 전 갱신과 응답 후 재시도는 같은 Promise를 공유해 동시에 한 번만 재발급하고, `/auth/*` 등 제외 대상이나 토큰 없이 보낸 요청은 재시도하지 않습니다. 재발급도 실패하면 토큰을 지우고 `onSessionExpired`로 알려 `AuthProvider`가 로그인 상태를 비웁니다. 재발급 도중 로그아웃하거나 다른 계정으로 로그인하면 이전 세션의 결과는 저장하지 않습니다.
- 이미지는 [uploadImage.ts](../../src/shared/api/uploadImage.ts)의 `uploadImage(file)`로 올립니다. `GET /images/presigned-url`로 받은 presigned URL에 파일을 `PUT`하고, 서명 쿼리를 뗀 S3 주소를 돌려줍니다. S3 요청에는 `baseURL`·JSON 헤더·`Authorization`이 붙으면 안 되므로 이 요청만 기본 `axios`로 보냅니다. 서버는 이미지 URL을 1000자까지만 받아 data URL은 보낼 수 없습니다.
- 게시글은 [postApi.ts](../../src/features/post/api/postApi.ts)에서 서버의 `contents`(`contentOrder` 순서의 TEXT·IMAGE 조각)를 `PostContentBlock[]`으로 바꿉니다. 게시글 id는 UUID 문자열이고 목록 `page`는 1부터 셉니다. 로그인했으면 `/posts/token`으로 상세를 불러와 `isOwner`로 내 글인지 판단합니다. 서버는 UUID 형식이 아닌 id에 500으로 응답하므로 `getPostDetail`이 요청 전에 걸러 없는 글(`null`)로 보고, 400·404만 없는 글로 처리합니다. 그 밖의 실패는 던져서 페이지가 `PostLoadError`로 다시 시도하게 합니다. 작성 응답에 id가 없어 게시 후에는 메인으로 이동하고, 사용자별 글 목록 API가 없어 사용자 페이지는 전체 목록(`getAllPosts`)을 닉네임으로 거릅니다.
- 댓글은 목록 API가 없어 게시글 상세 응답의 `comments`로 받습니다. [commentApi.ts](../../src/features/comment/api/commentApi.ts)의 `toPostComment`로 바꾸고, 내 댓글인지는 댓글마다 오는 `isOwner`로 판단합니다. 작성은 `POST /comments/{postId}`, 삭제는 `DELETE /comments/{commentId}`이며 작성자는 서버가 토큰으로 정합니다.
- 새 API 요청은 `fetch`나 별도의 `axios.create()` 대신 이 인스턴스(`api`)를 재사용합니다.

## 권장 패턴: TanStack Query + Axios Interceptor

이슈 템플릿의 "권장 추가 구현" 항목에서 API 연동 시 임시방편의 `fetch`/`axios` 직접 호출보다 이 조합을 우선 고려하도록 안내하고 있습니다.

> **참고**: TanStack Query(`@tanstack/react-query`)는 설치되어 있고, `QueryClientProvider`는 [App.tsx](../../src/app/App.tsx)에 있습니다. 게시글([postQueries.ts](../../src/features/post/api/postQueries.ts))은 작성·수정·삭제 성공 시 게시글 쿼리를 통째로 무효화합니다. 댓글([commentQueries.ts](../../src/features/comment/api/commentQueries.ts))은 상세 응답에 담겨 오는데 `comment`가 `post` 쿼리 키를 알면 순환 import가 생기므로, 등록·삭제 성공 시 무효화는 페이지가 넘긴 콜백(`onCommentChange`)이 합니다.

### Axios Interceptor

공통 에러 처리, 인증 토큰 주입 등이 필요하면 `src/shared/api/instance.ts`에 인터셉터를 추가합니다.

```ts
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // 공통 에러 처리 (예: 401 처리, 토스트 알림 등)
    return Promise.reject(error);
  },
);
```

### TanStack Query 사용 예시

API 요청 함수는 해당 도메인의 `api/` 폴더(`src/features/{도메인}/api/`)에 작성하고, 도메인의 `index.ts`로 공개합니다. 조회(`getPosts`)와 생성·수정·삭제(`createPost`) 요청 모두 같은 `api/` 폴더에 둡니다. 컴포넌트/페이지에서는 `useQuery`/`useMutation`으로 감싸 사용합니다.

```ts
// src/features/post/api/getPosts.ts
import { api } from '@/shared/api/instance';

import type { PostSummary } from '../model/types';

export const getPosts = () => api.get<PostSummary[]>('/posts').then((res) => res.data);
```

```tsx
// 사용하는 컴포넌트
import { useQuery } from '@tanstack/react-query';
import { getPosts } from '@/features/post'; // index.ts에서 getPosts를 공개

function PostList() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['posts'],
    queryFn: getPosts,
  });
  // ...
}
```

`QueryClientProvider`는 앱 최상단(`src/app/main.tsx` 또는 `src/app/App.tsx`)에서 한 번만 설정합니다.

## 체크리스트

API 연동 작업을 포함한 PR을 올리기 전에 확인하세요:

- [ ] `fetch` 직접 호출 대신 `api` 인스턴스 또는 TanStack Query를 사용했는지
- [ ] 환경 변수(`VITE_API_BASE_URL` 등)가 `.env`에만 있고 커밋되지 않았는지
- [ ] 불필요한 `console.*` 호출을 제거했는지
