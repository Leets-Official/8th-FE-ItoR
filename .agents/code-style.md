# Gitlog Code Style

이 문서는 코드를 작성하고 검증하는 방식을 정한다. 아직 도입하지 않은 도구의 규칙은 도입 시 적용한다.

## Core Principles

- 이름과 책임을 읽기 쉽게 정하고, 한 컴포넌트나 함수가 지나치게 많은 일을 맡지 않게 한다(SRP, KISS).
- 중복이 실제로 반복될 때 공통화한다(DRY). 미래의 사용만 예상해 추상화하지 않는다.
- 파생 가능한 값은 별도 상태에 중복 저장하지 않는다.

## TypeScript

### Strict Types

- `tsconfig.json`의 `strict` 검사를 유지한다.
- `any` 대신 구체적인 타입을 사용한다. 외부 데이터처럼 타입을 아직 확신할 수 없으면 `unknown`으로 받고 확인한 뒤 사용한다.
- 타입 단언으로 API 응답 검증을 대신하지 않는다.

### Type vs Interface

- props와 일반 객체 형태에는 `interface`를 선호한다.
- 유니온, 튜플, 매핑·조합 타입에는 `type`을 사용한다. 기존 코드의 일관성과 표현의 명확성을 우선한다.

```ts
interface PostCardProps {
  title: string;
  onOpen: () => void;
}

type RequestStatus = 'idle' | 'loading' | 'success' | 'error';
```

### Exports

- 컴포넌트와 유틸리티는 이름 있는 export를 기본으로 한다.
- 현재 라우트 페이지도 이름 있는 export를 사용하고 lazy import에서 default로 매핑한다. 도구가 default export를 요구하는 파일은 해당 도구의 규약을 따른다.

## React

### Hooks and Memoization

- `useMemo`, `useCallback`, `React.memo`는 측정된 성능 문제나 명확한 참조 안정성 요구가 있을 때 사용한다.
- `useRef`는 DOM 접근이나 렌더링에 참여하지 않는 가변 값 등 용도가 분명할 때 사용한다.
- 단일 컴포넌트 상태는 우선 `useState`로 관리한다.

### React Compiler

- React Compiler를 도입한다면 먼저 빌드 설정과 호환성을 확인한다. 최적화 여부를 설정 확인 없이 가정하지 않는다.
- 도입 후에도 컴파일러를 이유로 `useMemo`·`useCallback`을 기계적으로 추가하거나 제거하지 않는다. 실제 동작과 성능을 확인한다.
- 새 컴포넌트의 ref 전달은 사용 중인 React·UI 라이브러리의 지원 방식에 맞춘다. 불필요한 `forwardRef` 래퍼는 만들지 않는다.

### State Ownership

- 서버 데이터의 조회·변경·캐시는 TanStack Query로 관리하고, API 함수·Query 훅·Query Key는 `features/{feature}/api/`에 둔다.
- 단일 컴포넌트 상태는 지역 `useState`, 기능 안에서 공유하는 클라이언트 상태·타입은 `features/{feature}/model/`에 둔다.
- 여러 기능이 공유하는 클라이언트 상태는 필요할 때 `shared/stores/`에 둔다. 서버 데이터를 별도 store나 미리보기 상태에 중복 저장하지 않는다.
- 토큰 읽기·쓰기·삭제는 인증 관리 코드로 모으고, 로그아웃·계정 변경 시 이전 사용자 캐시를 정리한다.

## Import

### Path Alias

- 같은 폴더의 파일은 상대 경로를 사용하고, 멀리 떨어진 `src` 내부 파일은 설정된 `@/` alias를 사용한다.
- 여러 단계의 `../`로 계층을 가로지르는 import는 피한다.

```ts
// Good
import { cn } from '@/shared/utils/cn';

// Avoid
import { cn } from '../../../shared/utils/cn';
```

### Import Order

- React, 외부 라이브러리, 내부 모듈 순으로 묶는다. `import type`은 해당 그룹에 두거나 별도 그룹으로 모으되 파일 안에서 일관되게 작성한다.
- 설정된 Prettier·ESLint 규칙과 자동 수정 결과를 우선한다.

## Naming Conventions

| Item                   | Rule                      | Example                          |
| ---------------------- | ------------------------- | -------------------------------- |
| Component              | PascalCase                | `PostCard`, `PageHeader`         |
| Hook                   | `use` + PascalCase        | `usePostList`                    |
| Utility function       | camelCase                 | `formatDate`, `cn`               |
| Constant               | UPPER_SNAKE_CASE          | `POSTS_PER_PAGE`                 |
| Type / Interface       | PascalCase                | `PostCardProps`, `RequestStatus` |
| Zustand store, 도입 시 | `use{Name}Store`          | `useDraftStore`                  |
| cva variants           | `{componentName}Variants` | `buttonVariants`                 |
| CSS variable           | kebab-case, 의미 기반     | `--gitlog-action`                |
| SVG icon export        | PascalCase + `Icon`       | `CreateIcon`                     |

## File Naming

| File Type              | Rule                   | Example                              |
| ---------------------- | ---------------------- | ------------------------------------ |
| 새 React 컴포넌트      | PascalCase.tsx         | `PostCard.tsx`                       |
| shadcn/ui primitive    | CLI가 생성한 이름 유지 | `button.tsx`                         |
| Hook / Store           | camelCase.ts           | `usePostList.ts`, `useDraftStore.ts` |
| Utility                | camelCase.ts           | `formatDate.ts`, `cn.ts`             |
| SVG icon asset         | snake_case.svg         | `add_photo_alternate.svg`            |
| 현재 SPA의 Route page  | PascalCase.tsx         | `app/routes/HomePage.tsx`            |
| Barrel export, 필요 시 | index.ts               | `shared/ui/index.ts`                 |

현재 라우팅은 `app/App.tsx`의 BrowserRouter·Routes·Route로 구성하고, URL에 연결되는 페이지는 `app/routes/`에 둔다. Framework mode로 전환하지 않는 한 `root.tsx`나 별도 라우터 설정 파일을 추가하지 않는다.

## Tailwind CSS

- 모바일 우선으로 작성하고, 기존 디자인 토큰 클래스를 우선 사용한다.
- 조건에 따라 클래스를 합칠 때 `shared/utils/cn.ts`의 `cn()`을 사용한다.
- `cva`는 variant·size 조합이 실제로 반복되는 컴포넌트에 사용한다. 단순한 조건 분기에는 불필요한 variants 정의를 만들지 않는다.

```tsx
// Good: 현재 정의된 Gitlog 토큰 사용
<span className={cn('text-gitlog-action', disabled && 'opacity-50')} />

// Avoid: 동일한 의미의 색을 컴포넌트마다 직접 입력
<span className="text-[#5a9fff]" />
```

### Design Token Usage

- 전역 디자인 토큰은 `src/app/styles/global.css`에서 관리한다. 필요한 토큰이 없어서 새 토큰이나 하드코딩이 필요하면 먼저 사용자에게 디자인 의도를 확인한다.
- Figma 정의와 `src/app/styles/global.css`의 실제 토큰을 확인하고 색상·타이포그래피·간격·그라데이션에 의미가 맞는 클래스를 사용한다.
- 문서 예시에만 있는 토큰 이름을 실제 정의 없이 사용하지 않는다.

## Responsive

- Figma가 제공하는 데스크톱·모바일 화면에 맞춰 모바일 우선 반응형 스타일을 작성한다.
- 고정 모바일 너비가 디자인 요구사항으로 확인되면 `--app-mobile-width` 같은 토큰을 정의해 해당 화면의 최대 너비에 적용한다. 이 토큰은 현재 정의되어 있지 않다.
- 고정 너비가 필요한 경우에도 작은 화면에서 가로 스크롤이 생기지 않도록 `w-full`과 `max-width`를 조합한다. 임의의 breakpoint를 전역 규칙으로 추가하지 않는다.

## Component Guidelines

- 기능 전용 컴포넌트는 `features/{feature}/ui/`, URL에 연결되는 페이지는 `app/routes/`, 공통 레이아웃은 `app/layouts/`에 둔다.
- 재사용하는 컴포넌트는 필요할 때 `className`과 해당 HTML 요소의 표준 속성을 받는다.
- shadcn/ui 기본 요소는 `shared/ui/primitives/`, Gitlog 공통 UI는 `shared/ui/`에 둔다.

### Accessibility

- 동작에는 `button`, 이동에는 링크, 입력에는 연결된 `label` 등 의미에 맞는 HTML 요소를 사용한다.
- 키보드로 접근·조작할 수 있게 하고 포커스 표시를 숨기지 않는다.
- 시각적 상태가 있는 컨트롤은 실제 동작과 일치하는 `aria-*` 속성을 사용한다. 의미가 이미 전달되는 요소에 ARIA를 중복해서 붙이지 않는다.
- 폼 오류는 해당 입력과 연결하고, 토스트·모달의 접근성 동작은 사용 중인 primitive가 제공하는 규약을 따른다.

### Variant and Accessibility Example

여러 스타일·크기 조합이 있는 선택 버튼은 `cva`로 클래스를 정리하고, 선택 상태는 `aria-pressed`로 전달한다. 아래 예시는 현재 정의된 Gitlog 토큰을 사용한다.

```tsx
import type { ComponentProps } from 'react';

import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/shared/utils/cn';

const filterButtonVariants = cva(
  'inline-flex items-center justify-center rounded-md border focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
  {
    variants: {
      variant: {
        neutral: 'border-border bg-background text-foreground aria-pressed:bg-muted',
        action:
          'border-gitlog-action bg-background text-gitlog-action aria-pressed:bg-gitlog-action aria-pressed:text-white',
      },
      size: {
        sm: 'h-8 px-3 text-sm',
        md: 'h-10 px-4 text-base',
      },
    },
    defaultVariants: { variant: 'neutral', size: 'md' },
  },
);

interface FilterButtonProps
  extends ComponentProps<'button'>, VariantProps<typeof filterButtonVariants> {
  pressed: boolean;
}

function FilterButton({
  className,
  pressed,
  size,
  variant,
  type = 'button',
  ...props
}: FilterButtonProps) {
  return (
    <button
      {...props}
      type={type}
      aria-pressed={pressed}
      className={cn(filterButtonVariants({ variant, size }), className)}
    />
  );
}

export { FilterButton, filterButtonVariants, type FilterButtonProps };
```

## API and UI States

- HTTP 요청은 기능별 API 함수에서 공통 axios 인스턴스 `shared/apis/client.ts`의 `api`로 보낸다. 외부 저장소 업로드에는 백엔드 인증 헤더를 보내지 않는다.
- 요청·응답 타입은 명세를 확인해 작성하고, 응답의 중첩 데이터 추출을 UI마다 반복하지 않는다. 인증 헤더·토큰 저장·재발급은 확인된 서버 계약과 정책에 맞춘다.
- 조회는 `useQuery`, 변경은 `useMutation`으로 연결한다. Query Key에 id·필터·페이지 등 결과를 바꾸는 조건을 포함하고, 변경 성공 시 관련 캐시를 갱신하거나 무효화한다.
- 인터셉터나 Query 훅에서 오류를 성공으로 바꾸지 않는다. `queryFn`에서 라우팅·다이얼로그 조작을 하지 않는다.
- 로딩·오류·빈 결과·성공 상태를 상황에 맞게 표시하고 요청 중 중복 제출을 막는다. 성공 처리는 서버 응답 이후에 수행하며, 입력 오류는 해당 입력 또는 폼에 표시한다.

## Formatting

- ESLint flat config는 기본 JavaScript·TypeScript 권장 규칙과 React Hooks 규칙을 적용한다. `npm run lint`로 확인하고, 자동 수정은 `npm run lint:fix`를 사용한다.
- TypeScript 버전과 도구 설정은 현재 `package.json`·`tsconfig.json`을 기준으로 확인한다. 문서만으로 버전이나 호환성을 가정하지 않는다.
- Prettier는 `npm run format`으로 적용하고 `npm run format:check`로 확인한다. Tailwind 클래스는 `prettier-plugin-tailwindcss`가 정렬한다.
- ESLint와 Prettier의 스타일 규칙 충돌은 `eslint-config-prettier`로 끈다. 코드 포맷은 Prettier 설정을 따른다.

## Comments

- 코드가 설명하는 내용을 주석으로 반복하지 않는다.
- 주석은 코드만으로 알기 어려운 선택 이유, 제약, 우회 방법을 설명할 때 작성한다.

## Verification and PR Notes

- 코드·빌드 설정 변경 후 `npm run lint`, `npm run format:check`, `npm run typecheck`, `npm run build`를 실행한다. 위험한 로직은 실패·경계 조건을 포함한 적절한 동작 검증을 추가한다.
- 문서만 변경하면 대상 문서의 Prettier 포맷, 상대 참조, 코드·계약과의 일관성을 확인한다. 앱 동작을 바꾸지 않은 문서 편집 때문에 전체 빌드·런타임 검증을 반복하지 않는다.
- API 변경은 연결 범위의 성공·실패·인증·업로드 흐름을 확인하고 실제 요청 검증과 정적 검증을 구분해 보고한다.
- 기능 PR에는 구현 범위, 선택한 방식과 이유, 고려한 대안, 검증 환경·방법·결과와 남은 제약을 간단히 기록한다. Lighthouse 측정이 가능하면 API가 연결된 대표 모바일·데스크톱 페이지의 배포 빌드에서 성능·접근성·모범 사례·SEO 각각 90점 이상을 목표로 확인하고 결과를 기록한다.
