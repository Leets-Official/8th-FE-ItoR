---
paths:
  - 'src/**/*.{ts,tsx}'
---

# 데이터 플로우

```
데이터 출처 (features/{도메인} — 지금은 mocks.ts, 연동 후 요청 함수·쿼리)
  → pages (상태 소유 · 데이터 가공 · 도메인 컴포넌트 조합)
    → features/{도메인} 표시 컴포넌트 (props로 받아 표시)
    → features/{도메인} 행동 컴포넌트 (사용자 행동 처리 → 결과를 콜백·쿼리 무효화로 알림)
    → shared/ui (controlled: 값 + on{Event} 콜백)
```

- **상태는 페이지가 소유합니다.** 페이지가 데이터를 불러오고, 현재 페이지에 보여줄 목록·현재 페이지 번호 같은 화면 상태를 `useState`로 관리한 뒤 props로 내려줍니다. (예: [BlogSearchPage.tsx](../../src/pages/BlogSearchPage.tsx)의 `currentPage`)
- **표시 컴포넌트는 표시만 합니다.** (`PostListItem`, `PostMeta` 등) 도메인 데이터(`post: PostSummary`)를 props로 받아 렌더링하고, 데이터를 직접 불러오거나 바꾸지 않습니다. 표시용 변환(날짜 포맷 등)은 컴포넌트 안에서 합니다.
- **행동 컴포넌트는 행동과 그 상태를 가집니다.** (`LoginModal`, 댓글 작성 폼 등) 폼 입력값, 제출 중 여부, 등록·수정·삭제 요청은 해당 도메인 폴더에 둡니다. 결과는 콜백(`onSuccess`)이나 쿼리 무효화로 위에 알립니다.
- **shared/ui 컴포넌트는 controlled 방식입니다.** 값과 변경 콜백을 함께 받고(`currentPage` + `onPageChange`), 사용자 입력은 콜백으로 위에 알립니다. 상태를 바꾸는 쪽은 항상 부모입니다.
- **도메인 타입은 `features/{도메인}/model/types.ts`에 한 번만 정의합니다.** 목업과 API 응답이 같은 타입을 따르므로, API를 연동할 때는 데이터 출처만 바꾸고 컴포넌트는 그대로 둡니다.
- **로그인 상태는 앱 전체에서 공유합니다.** [App.tsx](../../src/app/App.tsx)의 `<AuthProvider>`(React Context)가 소유하고, 페이지에서 `useAuth()`로 `currentUser`를 읽어 props로 내려줍니다. 인증 API 연동 전에는 `features/auth/api/mocks.ts`의 목업 계정으로 로그인합니다.
- **서버 상태**는 TanStack Query로 관리합니다 ([api.md](./api.md)). 페이지가 `useQuery`로 불러오고, 등록·삭제는 도메인의 `useMutation` 훅이 처리한 뒤 쿼리를 무효화합니다. 별도의 전역 클라이언트 상태 라이브러리는 쓰지 않습니다.
- **로그인 모달은 앱에 하나만 둡니다.** [RootLayout.tsx](../../src/app/RootLayout.tsx)의 `<LoginModalProvider>`가 열림 상태를 소유하고, 로그인이 필요한 곳에서는 `LoginModal`을 직접 렌더링하지 않습니다. 페이지가 `useLoginModal()`로 `openLoginModal`을 꺼내 도메인 컴포넌트에 콜백(`onLoginRequest`)으로 내려줍니다. 도메인 컴포넌트는 다른 도메인의 Context를 직접 읽지 않습니다. (예: [BlogDetailPage.tsx](../../src/pages/BlogDetailPage.tsx) → `CommentSection`) 비로그인으로 접속하면 처음 한 번 자동으로 열립니다(`/signup`·`/signup/email`로 바로 들어온 경우는 제외).
- **사이드바도 앱에 하나만 둡니다.** [RootLayout.tsx](../../src/app/RootLayout.tsx)가 사이드바·로그아웃 확인 모달의 열림 상태를 소유하고, 페이지는 `useSidebar()`(`shared/ui`)의 `openSidebar`를 헤더의 `onMenu`에 연결만 합니다. 페이지에서 `Sidebar`를 직접 렌더링하지 않습니다. `pages`는 `app`을 import할 수 없어서 Context와 훅은 `shared/ui`에 둡니다.
- **카카오 로그인 flow**: 카카오에서 `/oauth/kakao`로 돌아오면 [KakaoCallbackPage.tsx](../../src/pages/KakaoCallbackPage.tsx)가 출발한 페이지(`state`)로 되돌립니다. 가입되지 않은 계정이면 location state(`KAKAO_SIGN_UP_PROMPT_STATE`)를 함께 넘겨 [RootLayout.tsx](../../src/app/RootLayout.tsx)의 확인 모달이 그 페이지 위에서 회원가입 여부를 묻고, 회원가입 페이지에서 출발했으면 묻지 않고 `/signup/kakao`로 보냅니다. (서버 연동 전에는 모두 가입되지 않은 계정으로 봅니다)
- **토스트처럼 앱 전체에 걸친 UI**는 `<Toaster />`를 [App.tsx](../../src/app/App.tsx)에 한 번만 두고, 어디서든 `showToast(type, message)`로 띄웁니다.
