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

> **참고**: 현재 `package.json`에는 TanStack Query(`@tanstack/react-query`)가 아직 설치되어 있지 않습니다. 사용하려면 먼저 의존성을 추가하세요.
>
> ```bash
> npm install @tanstack/react-query
> ```

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

API 요청 함수는 FSD 슬라이스의 `api/` 세그먼트에 작성하고, 슬라이스의 `index.ts`로 공개합니다. 컴포넌트/페이지에서는 `useQuery`/`useMutation`으로 감싸 사용합니다.

- **조회(GET)처럼 데이터를 읽어오는 기본 요청** → `src/entities/{엔티티}/api/` (예: `getPosts`, `getPost`)
- **사용자 행동에 따른 생성·수정·삭제 요청** → `src/features/{행동}/api/` (예: `features/write-post/api/createPost.ts`)

구분 기준은 [architecture.md](./architecture.md)의 계층별 역할을 참고하세요.

```ts
// src/entities/post/api/getPosts.ts
import { api } from '@/shared/api/instance';

import type { PostSummary } from '../model/types';

export const getPosts = () => api.get<PostSummary[]>('/posts').then((res) => res.data);
```

```tsx
// 사용하는 컴포넌트
import { useQuery } from '@tanstack/react-query';
import { getPosts } from '@/entities/post'; // index.ts에서 getPosts를 공개

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
