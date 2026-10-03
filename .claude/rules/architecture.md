# 아키텍처 (도메인 기반 구조)

## 엔트리 체인

```
index.html → src/app/main.tsx (StrictMode로 App 마운트) → src/app/App.tsx
```

## TypeScript 설정

- [tsconfig.json](../../tsconfig.json): solution 스타일 루트 설정, 아래 두 설정을 참조만 합니다.
  - [tsconfig.app.json](../../tsconfig.app.json): 앱 소스(`src`)용. `moduleResolution: bundler`, `noEmit`, `noUnusedLocals`/`noUnusedParameters` 등 엄격한 검사, `@/*` → `./src/*` 경로 별칭.
  - [tsconfig.node.json](../../tsconfig.node.json): Vite 설정 파일 등 Node 환경 툴링용.

## 경로 별칭

`@/*`가 `src/*`를 가리킵니다 ([vite.config.ts](../../vite.config.ts), [tsconfig.app.json](../../tsconfig.app.json)). 예: `import { api } from '@/shared/api/instance'`.

## 디렉터리 구조

최상위 폴더는 `app` · `pages` · `features` · `shared` 네 개입니다. 도메인 코드는 `features/{도메인}/`에 모으고, 도메인과 무관한 재사용 코드는 `shared/`에 둡니다.

```
src/
├── app/                    # 앱 전체 설정·조립
│   ├── App.tsx             # RouterProvider, 전역 <Toaster />
│   ├── router.tsx          # 라우터 설정 (createBrowserRouter)
│   ├── main.tsx            # 엔트리 — 전역 스타일 임포트, App 마운트
│   └── styles/             # 전역 스타일 (Tailwind 임포트, @theme 디자인 토큰)
├── pages/                  # 라우트 하나 = 파일 하나 (하위 폴더 없음)
│   ├── BlogSearchPage.tsx  # / — 블로그 찾기
│   └── BlogDetailPage.tsx  # /posts/:postId — 블로그 상세
├── features/               # 도메인별 폴더 — 컴포넌트·타입·목업·유틸을 함께 둠
│   ├── post/               # 게시글
│   │   ├── PostListItem.tsx · PostTitleSection.tsx · PostMeta.tsx · PostContent.tsx
│   │   ├── types.ts        # PostSummary, PostAuthor, PostDetail …
│   │   ├── mocks.ts        # API 연동 전 목업 → 연동 후 요청 함수도 이 폴더에
│   │   ├── formatPostDate.ts
│   │   └── index.ts        # Public API
│   ├── auth/               # 로그인 (LoginModal, LoginFields)
│   └── comment/            # 댓글 영역 (CommentSection)
├── shared/                 # 도메인을 모르는 재사용 코드
│   ├── api/                # axios 인스턴스 — api.md 참고
│   ├── lib/                # 도메인 무관 유틸 — utils.ts의 cn() (clsx + tailwind-merge)
│   ├── assets/
│   │   ├── icons/          # SVG 아이콘
│   │   └── images/         # 프로필 등 이미지 에셋
│   └── ui/                 # 공통 UI 컴포넌트 (Button, Icon, Modal, TextField …) + index.ts
└── vite-env.d.ts
```

- **도메인 폴더는 평평하게 둡니다.** `ui/`·`model/` 같은 하위 폴더 없이 파일을 바로 둡니다. 파일이 10개를 넘어 찾기 어려워지면 그때 `components/` 등으로 나눕니다.
- 도메인 폴더는 처음 필요해질 때 만들고, 빈 폴더를 미리 만들지 않습니다.
- **`pages`에는 하위 폴더를 만들지 않고 `{이름}Page.tsx` 파일만 둡니다.** 페이지는 상태 관리와 조립만 하고, 화면 조각은 `features`·`shared`에 둡니다.

### 어디에 둘까

| 위치                | 담는 것                             | 판단 질문                                     | 예시                               |
| ------------------- | ----------------------------------- | --------------------------------------------- | ---------------------------------- |
| `app`               | 라우터, Provider, 전역 스타일       | 앱 전체에 한 번만 필요한가?                   | `App.tsx`, `QueryClientProvider`   |
| `pages`             | 라우트 하나에 대응하는 화면         | URL이 있는가?                                 | `BlogSearchPage`, `BlogDetailPage` |
| `features/{도메인}` | 특정 도메인 데이터·행동을 아는 코드 | 게시글·댓글·로그인 같은 도메인을 알아야 하나? | `PostListItem`, `LoginModal`, 목업 |
| `shared`            | 도메인을 모르는 재사용 코드         | 블로그가 아닌 프로젝트에서도 쓸 수 있는가?    | `Button`, `cn()`, axios 인스턴스   |

- 처음에는 쓰는 도메인 폴더에 두고, 도메인을 모르는 코드가 두 번째 사용처에서 필요해지면 `shared`로 올립니다. 미리 올리지 않습니다.

### 의존 방향

```
app → pages → features → shared
```

- **위쪽은 아래쪽만 import합니다.** `shared`는 `features`·`pages`·`app`을 import하지 않습니다.
- **도메인끼리는 서로 import할 수 있지만 순환 import는 금지합니다.** (예: `comment` → `auth`의 `LoginModal` ✅, 이때 `auth` → `comment` ❌) 순환이 생기면 공통 부분을 `shared`로 내리거나 페이지에서 조합합니다.

### import 경로와 Public API 규칙

- **도메인 폴더는 `index.ts`로만 공개합니다.** 바깥에서는 도메인 폴더 루트로 import하고, 내부 파일 경로로 들어가지 않습니다.
  ```ts
  import { MOCK_POSTS, PostListItem } from '@/features/post'; // ✅
  import { PostListItem } from '@/features/post/PostListItem'; // ❌ 내부 경로 직접 접근
  ```
- `index.ts`에는 바깥에서 쓰는 것(컴포넌트, 도메인 타입, API 함수, 외부에서 쓰는 변형 타입)만 이름을 하나씩 나열해 re-export합니다. `export *`는 쓰지 않고, 내부 전용 상수·Props 타입·하위 컴포넌트는 공개하지 않습니다. 타입만 공개할 때는 `export type { … }`을 씁니다.
- **같은 도메인 폴더(또는 `shared`의 같은 하위 폴더) 안에서는 상대 경로로 import합니다.** 자기 자신의 `index.ts`를 거치면 순환 참조가 생길 수 있습니다.
  ```ts
  // features/post/PostListItem.tsx
  import type { PostSummary } from './types';
  // shared/ui/Button.tsx
  import { Icon } from './Icon';
  ```
- 다른 도메인·최상위 폴더의 모듈은 `@/` 별칭으로 import합니다.
- **`shared`는 하위 폴더 단위로 공개합니다.**
  - `shared/ui`는 [index.ts](../../src/shared/ui/index.ts)로 공개합니다: `import { Button, Pagination } from '@/shared/ui';` 새 컴포넌트를 추가하면 `index.ts`에 등록합니다.
  - `shared/lib`, `shared/api`, `shared/assets`는 barrel 없이 파일 경로로 import합니다: `import { cn } from '@/shared/lib/utils';`
- **페이지 파일은 barrel 없이 파일 경로로 import합니다:** `import { BlogDetailPage } from '@/pages/BlogDetailPage';`
- `app/main.tsx`는 같은 폴더의 `./App.tsx`, `./styles/index.css`를 상대 경로로 import합니다.

## 라우팅

- 라우팅은 `react-router`의 `createBrowserRouter`로 [router.tsx](../../src/app/router.tsx)에서 설정합니다. [App.tsx](../../src/app/App.tsx)는 `react-router/dom`의 `RouterProvider`와 공통 UI를 배치합니다. 새 페이지는 `src/pages/{이름}Page.tsx`로 만들고 `router.tsx`의 라우트 배열에 추가합니다.
- 새 코드의 위치는 위 "어디에 둘까" 표의 판단 질문으로 정합니다.
