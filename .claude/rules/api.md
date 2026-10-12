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
- 새 API 요청은 `fetch`나 별도의 `axios.create()` 대신 이 인스턴스(`api`)를 재사용합니다.

## 권장 패턴: TanStack Query + Axios Interceptor

이슈 템플릿의 "권장 추가 구현" 항목에서 API 연동 시 임시방편의 `fetch`/`axios` 직접 호출보다 이 조합을 우선 고려하도록 안내하고 있습니다.

> **참고**: TanStack Query(`@tanstack/react-query`)는 설치되어 있고, `QueryClientProvider`는 [App.tsx](../../src/app/App.tsx)에 있습니다. 댓글([commentApi.ts](../../src/features/comment/commentApi.ts) · [commentQueries.ts](../../src/features/comment/commentQueries.ts))이 첫 적용 예시입니다 — API 연동 전에는 요청 함수가 메모리 목업 저장소로 응답하고, 등록·삭제 성공 시 목록 쿼리를 무효화합니다.

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

API 요청 함수는 해당 도메인 폴더(`src/features/{도메인}/`)에 작성하고, 도메인의 `index.ts`로 공개합니다. 조회(`getPosts`)와 생성·수정·삭제(`createPost`) 요청 모두 같은 도메인 폴더에 둡니다. 컴포넌트/페이지에서는 `useQuery`/`useMutation`으로 감싸 사용합니다.

```ts
// src/features/post/getPosts.ts
import { api } from '@/shared/api/instance';

import type { PostSummary } from './types';

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
