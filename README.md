# 8th-FE-Mission-ItoR

## 🎯 미션 요구사항

미션 진행 방법을 꼭 읽고 진행해주세요
[미션 진행 방법](https://leets-workspace.notion.site/3e3ca3362bee809b9342ed35b1993b83)

## ItoR이 성장하기 위해 고민해보면 좋을 요구사항

- useRef, useMemo, useCallback를 불필요하게 사용하지 않는 습관 만들기
- 클린 코드 원칙 지키기(SRP, DRY, KISS) 등 읽기 쉽고 유지보수하기 좋은 코드 만들기
- 접근성(a11y) 고려하기 - 시맨틱 HTML, 키보드 내비게이션, ARIA 속성 활용
- Tanstack Query + Axios Interceptor 활용
- 이미지 최적화, 이미지 Lazy 로딩하기
- Lighthouse 점수 90점 이상 유지하기
- Dynamic Import + Lazy Loading 적용

## 🎨 Blog UI 요구사항

Figma :[ https://www.figma.com/team_invite/redeem/DjdTfdfKC0X3ImzDcw0wbi](https://www.figma.com/design/4hyz65a9mwAkEKplbXcfyo/%EA%B0%9C%EB%B0%9C-%EA%B5%90%EC%9C%A1%EC%9A%A9-ui?node-id=0-1&m=dev)
<br/>
<br>

## 💡 공통 요구사항

- 공통 컴포넌트 / UI 컴포넌트 / 페이지 별 필요한 컴포넌트로 모듈화 하여 작업합니다.
- Error, Success 상태를 관리하고, 상태에 따른 결과를 사용자에게 UI로 보여 주셔야 합니다.
- 모든 방식에는 근거가 있어야 합니다. 왜 해당 방식을 / 기능을 선택하였는지 문서화 하여 매주 미션 PR에 남겨주세요.

## ⚙️ 기능 요구사항

백엔드 스웨거 : https://blog.leets.land/swagger-ui/index.html

### 회원가입

- 사용자는 이메일 주소 또는 카카오 OAuth를 통해 회원가입을 진행할 수 있어야 합니다.
- 사용자는 비밀번호를 생성하여 회원가입을 진행할 수 있어야 합니다.
- 사용자는 프로필사진을 등록하며 회원가입을 진행할 수 있어야합니다.
- 사용자가 입력한 이메일 주소와 닉네임은 시스템에 이미 등록되어 있지 않아야 합니다.

### 로그인

- 사용자는 등록한 이메일 주소 또는 카카오 로그인을 이용하여 로그인할 수 있어야 합니다.
- (토큰 방식으로 구현시) refresh token을 통해 새로운 access token을 발급받을 수 있어야 합니다.
- 토큰은 브라우저에 cookie / storage 중 원하는 방식을 골라 선택하신 후 저장 해 두셔야 합니다.

### 게시물

- 사용자는 로그인을 하지 않고도 게시물을 조회할 수 있어야 합니다.
- 사용자는 로그인을 진행해야 게시물을 작성할 수 있어야 합니다.
- 사용자는 자신의 게시물만 수정, 삭제할 수 있어야 합니다.
- 게시물은 페이지네이션이 가능해야 합니다.
- 게시물 리스트는 한 페이지에 10개까지 보여야 하며, 초과 시 다음 페이지에서 볼 수 있어야 합니다.
- 게시물 조회시 댓글도 모두 조회할 수 있어야 합니다.
- 게시물 작성 시, 텍스트와 이미지의 contentOrder도 트래킹 할 수 있어야 합니다.
  - 추후 READ 기능 구현 시 텍스트 / 이미지의 순서를 맞추어 렌더링 할 수 있게 해야 합니다.

### 댓글

- 사용자는 로그인을 하지 않고도 댓글을 확인할 수 있어야 합니다.
- 사용자는 댓글을 입력 하고 싶으면 로그인을 해야 합니다.
- 사용자는 자신의 댓글만 수정, 삭제할 수 있어야 합니다.

### 유저

- 사용자는 닉네임, 비밀번호, 프로필 사진을 변경할 수 있어야 합니다.
- 사용자는 자신의 정보를 조회할 수 있어야 합니다.

### 이미지

- 이미지는 Pre-Signed Url 방식으로 업로드 할 수 있어야 합니다.

### 반응형 디자인

- Figma에서 제공한 디자인 가이드에 맞춰 데스크톱·모바일 환경에 모두 대응하는 반응형 UI를 구현해야 합니다.

## 개발 환경

- 로컬 검증 환경: Node.js 25.9.0
- 패키지 매니저: pnpm 12.5.1
- React + TypeScript + Vite, Tailwind CSS v3, Axios
- ESLint + Prettier (Tailwind 클래스 정렬 포함)

```bash
pnpm install
pnpm dev
pnpm typecheck
pnpm lint
pnpm build
pnpm format:check
```

폴더 구조는 추후 UI 구현 단계에서 적용합니다.
