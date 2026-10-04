# Gitlog Architecture

이 문서는 코드의 위치와 역할을 정한다. 기능·디자인·성능 요구사항은 [prd.md](./prd.md), 코드 작성 방식은 [code-style.md](./code-style.md)를 따른다.

## Folder Structure

아래는 목표 구조다. 실제 파일이 아직 없는 폴더는 해당 기능을 구현할 때 만든다.

```text
src/
  main.tsx                 # Vite 진입점
  app/
    App.tsx                # 앱 조립
    routes/                # URL에 연결되는 페이지
    layouts/               # 여러 페이지가 공유하는 레이아웃
    providers/
      QueryProvider.tsx    # TanStack Query 전역 provider
    styles/global.css      # Tailwind, shadcn 테마, 디자인 토큰
  features/
    auth/
      ui/                  # 회원가입·로그인 UI
      api/                 # 인증 API와 Query 훅
      model/               # 인증 전용 타입·상태
      lib/                 # 인증 전용 순수 함수
    posts/
      ui/                  # 게시물 목록·상세·작성 UI
      api/                 # 게시물 API와 Query 훅
      model/               # 게시물 전용 타입·상태
      lib/                 # 게시물 전용 순수 함수
    comments/
      ui/                  # 댓글 UI
      api/                 # 댓글 API와 Query 훅
      model/               # 댓글 전용 타입·상태
      lib/                 # 댓글 전용 순수 함수
    profile/
      ui/                  # 내 정보·프로필 변경 UI
      api/                 # 사용자 정보 API와 Query 훅
      model/               # 프로필 전용 타입·상태
      lib/                 # 프로필 전용 순수 함수
  shared/
    apis/
      client.ts            # Axios 인스턴스와 공통 interceptor
    assets/icons/          # 공통 이미지·아이콘
    constants/             # 공통 상수
    hooks/                 # 공통 훅
    mocks/                 # 공통 개발·테스트 데이터
    stores/                # 필요할 때 전역 클라이언트 상태
    types/                 # 공통 타입
    ui/
      primitives/          # shadcn/ui CLI가 생성한 기본 컴포넌트
    utils/
      cn.ts                # 공통 클래스 병합 유틸리티
```

## Core Rules

### Layer Responsibilities

- `app/`은 앱 시작, URL 연결, 전역 provider·레이아웃·스타일을 담당한다.
- `features/`는 게시물·댓글·인증처럼 한 기능에 속한 UI, API 함수, 타입, 상태, 순수 로직을 둔다.
- `shared/`는 여러 기능에서 쓰는 코드와 공통 UI 기본 요소를 둔다.
- 의존 방향은 `app → features → shared`다. `shared`에서 `features`나 `app`을 가져오지 않는다.

### Component Placement

- 게시물에만 쓰는 컴포넌트 → `features/posts/ui/`
- 여러 기능에서 쓰는 Gitlog UI → `shared/ui/`
- shadcn/ui CLI가 생성한 기본 요소 → `shared/ui/primitives/`
- URL에 연결되는 페이지 → 라우터 도입 후 `app/routes/`
- 여러 페이지의 외곽 레이아웃 → `app/layouts/`

### Feature Folder Convention

`features/{feature}/`는 필요한 폴더부터 만든다. 게시물 목록과 상세의 코드는 `features/posts/`에 모은다.

- `ui/` — 해당 기능의 컴포넌트. 상세 HTTP 요청 구현은 여기에 넣지 않는다.
- `api/` — 해당 기능의 엔드포인트 함수와 TanStack Query 훅. 예: 게시물 조회는 `features/posts/api/`.
- `model/` — 해당 기능에서만 쓰는 타입과 상태. 여러 기능의 타입은 `shared/types/`.
- `lib/` — 검증·변환·포맷 등 순수 함수. 가능하면 React에 의존하지 않게 작성한다.

이미지 업로드는 별도 `uploads` 기능으로 나누지 않는다. 게시물 이미지는 `posts`, 프로필 사진은 `profile`에 둔다. 동일한 전송 절차가 두 곳에서 반복되면 공통 부분만 `shared/apis/`로 옮긴다.

### Shared Folder Convention

- `shared/apis/` — Axios 인스턴스, 공통 인터셉터, 재사용하는 HTTP 도우미
- `shared/assets/` — 공통 이미지, SVG, 아이콘
- `shared/constants/` — 공통 상수
- `shared/hooks/` — 여러 기능에서 재사용하는 훅
- `shared/mocks/` — 개발·테스트용 공통 목 데이터
- `shared/stores/` — 필요한 경우 전역 클라이언트 상태; 도구는 필요할 때 선택
- `shared/types/` — 여러 기능에서 공유하는 타입
- `shared/ui/` — Gitlog 공통 컴포넌트와 shadcn 기본 요소
- `shared/utils/` — 공통 순수 함수

### Design Tokens

- 전역 디자인 토큰은 `src/app/styles/global.css`에서 관리한다.
- 색상, 타이포그래피, 간격, 그라데이션 등 반복되는 디자인 값은 Figma의 정의와 기존 토큰을 확인하고 의미가 드러나는 토큰 클래스를 우선 사용한다.
- 필요한 값에 대응하는 토큰이 없어서 새 전역 토큰이나 하드코딩이 필요해 보이면, 먼저 사용자에게 디자인 의도를 확인한다.

### Routing

- 현재 프로젝트는 Vite SPA이며 React Router가 아직 설정되지 않았다. 컴포넌트 미리보기는 `app/ComponentGallery.tsx`에 있다.
- 라우터 도입 후 URL에 연결되는 페이지를 `app/routes/`에 둔다. 페이지는 `features`의 UI와 API를 가져와 조합할 수 있다.
- 원본 프로젝트의 `app/root.tsx`, `app/routes.ts`, `react-router.config.ts`는 React Router framework mode를 선택할 때만 추가한다.

### Re-export

- 공유 UI import가 많아지면 `shared/ui/index.ts`를 추가한다. 처음부터 모든 폴더에 `index.ts`를 만들지 않는다.
- Figma에서 추출한 SVG 아이콘은 `shared/assets/icons/`에 두고 `index.ts`에서 React 컴포넌트로 재수출한다. 애플리케이션 코드는 barrel에서 가져온다.
- 단색 아이콘은 실제 SVG 코드를 넣을 때 색상 속성에 `currentColor`를 사용할 수 있다. 여러 색을 쓰는 로고는 원래 색을 유지한다.
- 라우트 파일은 일괄 재수출하지 않는다.

```ts
// Good
import { CreateIcon } from "@/shared/assets/icons";

// Avoid
import CreateIcon from "@/shared/assets/icons/create.svg?react";
```

### Data Flow

- 서버 데이터 조회·변경 → `features/{feature}/api/`의 함수·Query 훅 → `shared/apis/client.ts`
- 단일 컴포넌트 상태 → 지역 `useState`
- 한 기능 안에서 공유하는 상태·타입 → `features/{feature}/model/`
- 여러 기능에서 공유해야 하는 클라이언트 상태 → 필요할 때 `shared/stores/`
- 순수 계산·검증·포맷 → 기능 전용이면 `features/{feature}/lib/`, 공통이면 `shared/utils/`

`app/routes/`는 기능 API 함수를 호출할 수 있지만 엔드포인트 URL이나 요청·응답 처리를 페이지 파일에 직접 구현하지 않는다. Pre-Signed URL로 외부 저장소에 파일을 업로드할 때는 백엔드용 baseURL·인증 인터셉터를 무조건 재사용하지 않는다.
