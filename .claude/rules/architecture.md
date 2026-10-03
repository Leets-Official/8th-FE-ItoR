# 아키텍처 (FSD)

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

## 디렉터리 구조 (FSD)

[Feature-Sliced Design(FSD)](https://feature-sliced.design/kr/)을 따릅니다. 폴더는 **계층(layer) → 슬라이스(slice) → 세그먼트(segment)** 세 단계로 나뉩니다.

- **계층**: 코드의 책임 범위. `app` · `pages` · `widgets` · `features` · `entities` · `shared`
- **슬라이스**: 계층 안에서 도메인·화면별로 나눈 폴더 (`entities/post`, `widgets/comment-section`). `app` · `pages` · `shared`에는 슬라이스가 없습니다.
- **세그먼트**: 슬라이스 안에서 코드 종류별로 나눈 폴더 — `ui/`(컴포넌트) · `model/`(타입·상태·훅) · `api/`(요청 함수·목업) · `lib/`(슬라이스 전용 유틸) · `config/`(상수)

```
src/
├── app/                    # 앱 전체 설정·조립 (슬라이스 없음)
│   ├── App.tsx             # 라우터 설정 (createBrowserRouter), 전역 <Toaster />
│   ├── main.tsx            # 엔트리 — 전역 스타일 임포트, App 마운트
│   └── styles/             # 전역 스타일 (Tailwind 임포트, @theme 디자인 토큰)
├── pages/                  # 라우트 하나 = 파일 하나 (하위 폴더 없음)
│   ├── BlogSearchPage.tsx  # / — 블로그 찾기
│   └── BlogDetailPage.tsx  # /posts/:postId — 블로그 상세
├── widgets/                # 여러 feature·entity를 묶은 화면 블록
│   └── comment-section/    # 댓글 영역 (제목·빈 상태·입력창)
│       ├── ui/CommentSection.tsx
│       └── index.ts
├── features/               # (필요할 때 추가) 사용자 행동 단위 — 검색, 글쓰기, 댓글 작성 …
├── entities/               # 비즈니스 도메인 단위
│   └── post/               # 게시글
│       ├── ui/PostListItem.tsx
│       ├── model/types.ts  # PostSummary, PostAuthor
│       ├── api/mocks.ts    # API 연동 전 목업 → 연동 후 요청 함수도 여기
│       └── index.ts        # Public API
├── shared/                 # 도메인을 모르는 재사용 코드 (슬라이스 없음, 세그먼트만)
│   ├── api/                # axios 인스턴스 — api.md 참고
│   ├── lib/                # 도메인 무관 유틸 — utils.ts의 cn() (clsx + tailwind-merge)
│   ├── assets/
│   │   ├── icons/          # SVG 아이콘 — 아래 "아이콘" 절 참고
│   │   └── images/         # 프로필 등 이미지 에셋
│   └── ui/                 # 공용 UI 컴포넌트 (Button, Icon, Modal, TextField …) + index.ts
└── vite-env.d.ts
```

`widgets`와 `features`처럼 아직 코드가 없는 계층은 처음 필요해질 때 만듭니다. 미리 빈 슬라이스를 만들지 않습니다.

**`pages`에는 하위 폴더를 만들지 않고 `{이름}Page.tsx` 파일만 둡니다.** 페이지는 조립만 하므로, 페이지를 이루는 화면 조각은 역할에 따라 `widgets`·`features`·`entities`에 둡니다. 페이지 파일은 barrel(`index.ts`) 없이 파일 경로로 import합니다. (`import { BlogSearchPage } from '@/pages/BlogSearchPage'`)

### 계층별 역할

| 계층       | 담는 것                                                | 판단 질문                                        | 예시                                        |
| ---------- | ------------------------------------------------------ | ------------------------------------------------ | ------------------------------------------- |
| `app`      | 라우터, Provider, 전역 스타일                          | 앱 전체에 한 번만 필요한가?                      | `App.tsx`, `QueryClientProvider`            |
| `pages`    | 라우트 하나에 대응하는 화면                            | URL이 있는가?                                    | `BlogSearchPage`, `BlogDetailPage`          |
| `widgets`  | 여러 feature·entity를 묶은 독립적인 화면 블록          | 여러 페이지에서 통째로 재사용하는 큰 덩어리인가? | 헤더 + 검색창, 댓글 영역 전체               |
| `features` | 사용자가 **하는 행동** (동사) — 가치를 만드는 상호작용 | "~한다"로 말할 수 있는가?                        | `search-post`, `write-comment`, `like-post` |
| `entities` | 비즈니스 **대상** (명사) — 데이터 모양과 기본 표시     | "~이다/~를 보여준다"로 말할 수 있는가?           | `post`, `comment`, `user`                   |
| `shared`   | 도메인을 모르는 재사용 코드                            | 이 프로젝트가 블로그가 아니어도 쓸 수 있는가?    | `Button`, `cn()`, axios 인스턴스            |

### 의존 방향

```
app → pages → widgets → features → entities → shared
```

- **위 계층은 아래 계층만 import합니다.** 아래 계층이 위 계층을 import하지 않습니다. (`shared`는 아무 계층도 import하지 않습니다)
- **같은 계층의 슬라이스끼리는 import하지 않습니다.** `features/like-post`가 `features/write-comment`를, `entities/post`가 `entities/user`를 import하면 안 됩니다. 여러 슬라이스를 함께 써야 하면 위 계층(`widgets`·`pages`)에서 조합합니다.
- 한 슬라이스에서만 쓰는 코드는 그 슬라이스 안에 두고, 도메인과 무관하게 여러 곳에서 쓰는 것만 `shared`로 올립니다.

### import 경로와 Public API(re-export) 규칙

- **슬라이스는 `index.ts`(Public API)로만 공개합니다.** 바깥에서는 슬라이스 루트로 import하고, 내부 세그먼트 경로로 들어가지 않습니다.
  ```ts
  import { MOCK_POSTS, PostListItem } from '@/entities/post'; // ✅
  import { PostListItem } from '@/entities/post/ui/PostListItem'; // ❌ 내부 경로 직접 접근
  ```
- `index.ts`에는 바깥에서 쓰는 것(컴포넌트, 도메인 타입, API 함수, 외부에서 쓰는 변형 타입)만 이름을 하나씩 나열해 re-export합니다. `export *`는 쓰지 않고, 내부 전용 상수·Props 타입·하위 컴포넌트는 공개하지 않습니다. 타입만 공개할 때는 `export type { … }`을 씁니다.
- **같은 슬라이스(또는 `shared`의 같은 세그먼트) 안에서는 상대 경로로 import합니다.** 자기 자신의 `index.ts`를 거치면 순환 참조가 생길 수 있습니다.
  ```ts
  // entities/post/ui/PostListItem.tsx
  import type { PostSummary } from '../model/types';
  // shared/ui/Button.tsx
  import { Icon } from './Icon';
  ```
- 다른 슬라이스·계층의 모듈은 `@/` 별칭으로 import합니다.
- **`shared`는 슬라이스가 없으므로 세그먼트 단위로 공개합니다.**
  - `shared/ui`는 [index.ts](../../src/shared/ui/index.ts)로 공개합니다: `import { Button, Pagination } from '@/shared/ui';` 새 컴포넌트를 추가하면 `index.ts`에 등록합니다.
  - `shared/lib`, `shared/api`, `shared/assets`는 barrel 없이 파일 경로로 import합니다: `import { cn } from '@/shared/lib/utils';`
- **`pages`도 슬라이스가 없으므로** 페이지 파일을 barrel 없이 파일 경로로 import합니다: `import { BlogDetailPage } from '@/pages/BlogDetailPage';`
- `app/main.tsx`는 같은 폴더의 `./App.tsx`, `./styles/index.css`를 상대 경로로 import합니다.

## 라우팅

- 라우팅은 `react-router-dom`의 `createBrowserRouter`로 [App.tsx](../../src/app/App.tsx)에서 설정합니다. 새 페이지는 `src/pages/{이름}Page.tsx`로 만들고 라우트 배열에 추가합니다.
- 새 코드를 어느 계층에 둘지는 위 "계층별 역할" 표의 판단 질문으로 정합니다.
