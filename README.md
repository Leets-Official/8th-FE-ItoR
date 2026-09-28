# GITLOG — 8th-FE-ItoR

Leets 8기 프론트엔드 부트캠프 미션 프로젝트입니다. 디자인 시안을 바탕으로 블로그 목록·상세 화면과 재사용 가능한 UI 컴포넌트를 구현합니다.

현재는 목업 데이터를 사용하는 프론트엔드 UI 단계입니다.

## 기술 스택

| 구분      | 사용 기술                                          |
| --------- | -------------------------------------------------- |
| UI        | React 19, TypeScript 6                             |
| 개발·빌드 | Vite 8                                             |
| 스타일    | Tailwind CSS v4, 디자인 토큰, clsx, tailwind-merge |
| 라우팅    | React Router 7 (`createBrowserRouter`)             |
| UI 기반   | Radix UI, class-variance-authority, Sonner         |
| HTTP      | Axios 공용 인스턴스 준비                           |
| 코드 품질 | ESLint, Prettier, Husky, lint-staged               |

## 프로젝트 구조

Feature-Sliced Design(FSD)을 기준으로 구성합니다. `@/`는 `src/` 경로를 가리킵니다.

```text
src/
├── app/                      # 앱 진입점, 라우팅, 전역 스타일·디자인 토큰
├── pages/                    # 페이지 상태 관리와 화면 조립
│   ├── BlogSearchPage.tsx
│   └── BlogDetailPage.tsx
├── widgets/
│   └── comment-section/      # 댓글 영역
├── entities/
│   └── post/
│       ├── api/              # 게시글 목업 데이터
│       ├── lib/              # 날짜 포맷 등 게시글 유틸리티
│       ├── model/            # 게시글·작성자 타입
│       ├── ui/               # 게시글 목록, 제목, 메타 정보, 본문
│       └── index.ts          # 슬라이스 Public API
└── shared/
    ├── api/                  # 공용 Axios 인스턴스
    ├── assets/               # SVG 아이콘·이미지
    ├── lib/                  # cn 등 공용 유틸리티
    └── ui/                   # 도메인에 의존하지 않는 공통 UI
```

의존 방향은 `app → pages → widgets → features → entities → shared`입니다. `features`는 사용자 행동을 별도 기능으로 구현할 때 추가합니다. 슬라이스 외부에서는 `index.ts`의 Public API로 가져옵니다.

## 재사용 컴포넌트

| 위치                      | 컴포넌트                                                                 | 역할                                                 |
| ------------------------- | ------------------------------------------------------------------------ | ---------------------------------------------------- |
| `entities/post`           | `PostTitleSection`                                                       | 제목·부제목과 `PostMeta`, `Blank`를 조합한 제목 영역 |
| `entities/post`           | `PostMeta`                                                               | 목록과 상세에서 공유하는 작성자·작성일·댓글 수       |
| `entities/post`           | `PostListItem`, `PostContent`                                            | 목록 항목 및 텍스트·이미지 본문 표시                 |
| `widgets/comment-section` | `CommentSection`                                                         | 댓글 수·빈 상태·입력 UI 조합                         |
| `shared/ui`               | `PageHeader`, `CompactPageHeader`, `Pagination`, `Blank`                 | 헤더, 페이지 이동, 여백                              |
| `shared/ui`               | `Button`, `IconButton`, `Icon`, `TextField`, `TextFieldSet`, `TextBlock` | 기본 버튼·아이콘·입력·텍스트 UI                      |
| `shared/ui`               | `DropdownMenu`, `Menu`, `Modal`, `Toast`, `Toaster`, `showToast`         | 메뉴·모달·토스트 UI                                  |

게시글 컴포넌트는 데이터를 props로 받아 표시하고, 페이지는 데이터 조회와 페이지네이션 같은 상태를 관리합니다.

색상·타이포그래피 토큰은 `src/app/styles/index.css`의 `@theme`에 정의합니다. 컴포넌트에서는 토큰 기반 Tailwind 클래스를 사용하고, `className`은 `cn()`으로 조합합니다.

## 커밋·푸시 자동 검사

Husky 훅으로 다음 검사를 실행합니다.

| 시점         | 실행 내용                                                                                                                        |
| ------------ | -------------------------------------------------------------------------------------------------------------------------------- |
| `git commit` | `lint-staged`: 스테이징된 TS·TSX 파일에 `eslint --fix`와 `prettier --write`, JS·JSON·CSS·Markdown·HTML 파일에 `prettier --write` |
| `git push`   | `npm run lint && npm run build`: 전체 린트 통과 후 타입 검사와 빌드                                                              |

검사가 실패하면 해당 커밋 또는 푸시가 중단됩니다. 설정은 `.husky/pre-commit`, `.husky/pre-push`, `package.json`에서 관리합니다.

## 협업 규칙

- 브랜치: `{이름}/{숫자}주차`에서 작업하고 `{이름}/main`으로 PR을 올립니다.
- 커밋 메시지: `feat`, `fix`, `chore`, `refactor`, `docs` 접두사를 사용합니다.
- PR과 이슈는 `.github/`의 템플릿을 따릅니다.
- 상세한 구조·코딩 규칙은 [CLAUDE.md](./CLAUDE.md)와 `.claude/rules/`를 참고합니다.
