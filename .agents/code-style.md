# Gitlog Code Style

이 문서는 코드를 작성하는 방식을 정한다. 코드의 위치와 역할은 [architecture.md](./architecture.md), 기능·디자인 요구사항은 [prd.md](./prd.md)를 따른다. 아직 도입하지 않은 도구의 규칙은 도입 시 적용한다.

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
- 라우터 등 도구가 default export를 요구하는 파일은 해당 도구의 규약을 따른다. 현재 프로젝트에는 React Router가 설정되어 있지 않다.

## React

### Hooks and Memoization

- `useMemo`, `useCallback`, `React.memo`는 측정된 성능 문제나 명확한 참조 안정성 요구가 있을 때 사용한다.
- `useRef`는 DOM 접근이나 렌더링에 참여하지 않는 가변 값 등 용도가 분명할 때 사용한다.
- 단일 컴포넌트 상태는 우선 `useState`로 관리한다.

### React Compiler

- React Compiler를 도입한다면 먼저 빌드 설정과 호환성을 확인한다. 현재는 설정되어 있지 않으므로 컴파일러가 최적화한다고 가정하지 않는다.
- 도입 후에도 컴파일러를 이유로 `useMemo`·`useCallback`을 기계적으로 추가하거나 제거하지 않는다. 실제 동작과 성능을 확인한다.
- 새 컴포넌트의 ref 전달은 사용 중인 React·UI 라이브러리의 지원 방식에 맞춘다. 불필요한 `forwardRef` 래퍼는 만들지 않는다.

### State Ownership

- 서버 데이터의 조회·변경·캐시는 TanStack Query를 사용한다.
- 한 기능에만 필요한 상태는 `features/{feature}/model/`에서 관리한다.
- 여러 기능이 공유하는 클라이언트 상태가 실제로 필요해 Zustand를 도입하면 `shared/stores/`에 둔다. 서버 데이터를 Zustand에 중복 저장하지 않는다.
- 상태별 코드 위치는 [architecture.md의 Data Flow](./architecture.md#data-flow)를 따른다.

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
- Prettier·ESLint를 도입하면 실제 설정된 규칙과 자동 수정 결과를 우선한다.

## Naming Conventions

| Item | Rule | Example |
| --- | --- | --- |
| Component | PascalCase | `PostCard`, `PageHeader` |
| Hook | `use` + PascalCase | `usePostList` |
| Utility function | camelCase | `formatDate`, `cn` |
| Constant | UPPER_SNAKE_CASE | `POSTS_PER_PAGE` |
| Type / Interface | PascalCase | `PostCardProps`, `RequestStatus` |
| Zustand store, 도입 시 | `use{Name}Store` | `useDraftStore` |
| cva variants | `{componentName}Variants` | `buttonVariants` |
| CSS variable | kebab-case, 의미 기반 | `--gitlog-action` |
| 자체 SVG icon export, 도입 시 | PascalCase + `Icon` | `WriteIcon` |

## File Naming

| File Type | Rule | Example |
| --- | --- | --- |
| 새 React 컴포넌트 | PascalCase.tsx | `PostCard.tsx` |
| shadcn/ui primitive | CLI가 생성한 이름 유지 | `button.tsx` |
| Hook / Store | camelCase.ts | `usePostList.ts`, `useDraftStore.ts` |
| Utility | camelCase.ts | `formatDate.ts`, `cn.ts` |
| Route file, 라우터 도입 시 | 선택한 React Router 모드의 규약 | `app/routes/` 내부의 route module |
| Barrel export, 필요 시 | index.ts | `shared/ui/index.ts` |

라우팅 파일의 위치와 React Router 모드별 구조는 [architecture.md의 Routing](./architecture.md#routing)을 따른다. 라우터 도입 전부터 `root.tsx`나 `routes.ts`를 필수 파일로 취급하지 않는다.

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

- 토큰의 위치와 새 토큰을 추가할 때의 확인 기준은 [architecture.md의 Design Tokens](./architecture.md#design-tokens)를 따른다.
- Figma 정의와 `src/app/styles/global.css`의 실제 토큰을 확인하고 색상·타이포그래피·간격·그라데이션에 의미가 맞는 클래스를 사용한다.
- 문서 예시에만 있는 토큰 이름을 실제 정의 없이 사용하지 않는다.

## Responsive

- Figma가 제공하는 데스크톱·모바일 화면에 맞춰 모바일 우선 반응형 스타일을 작성한다.
- 고정 모바일 너비가 디자인 요구사항으로 확인되면 `--app-mobile-width` 같은 토큰을 정의해 해당 화면의 최대 너비에 적용한다. 이 토큰은 현재 정의되어 있지 않다.
- 고정 너비가 필요한 경우에도 작은 화면에서 가로 스크롤이 생기지 않도록 `w-full`과 `max-width`를 조합한다. 임의의 breakpoint를 전역 규칙으로 추가하지 않는다.

## Component Guidelines

- 컴포넌트의 위치는 [architecture.md의 Component Placement](./architecture.md#component-placement)를 따른다.
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

function FilterButton({ className, pressed, size, variant, type = 'button', ...props }: FilterButtonProps) {
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

- Axios 공통 클라이언트와 기능별 API의 위치는 [architecture.md의 Data Flow](./architecture.md#data-flow)를 따른다. UI 컴포넌트에 Axios 설정이나 엔드포인트 구현을 넣지 않는다.
- 인터셉터는 오류를 임의로 성공 처리하지 않는다. 호출자가 실패를 표시하거나 재시도할 수 있게 오류를 전달한다.
- 로딩, 실패, 빈 결과, 작업 성공을 상황에 맞는 문구로 보여 준다. 성공·실패 토스트만으로 폼의 개별 입력 오류를 대체하지 않는다.

## Formatting

- ESLint flat config는 기본 JavaScript·TypeScript 권장 규칙과 React Hooks 규칙을 적용한다. `npm run lint`로 확인하고, 자동 수정은 `npm run lint:fix`를 사용한다.
- `typescript-eslint` 지원 범위와 맞추기 위해 TypeScript는 `~6.0.0`을 사용한다.
- Prettier는 `npm run format`으로 적용하고 `npm run format:check`로 확인한다. Tailwind 클래스는 `prettier-plugin-tailwindcss`가 정렬한다.
- ESLint와 Prettier의 스타일 규칙 충돌은 `eslint-config-prettier`로 끈다. 코드 포맷은 Prettier 설정을 따른다.

## Comments

- 코드가 설명하는 내용을 주석으로 반복하지 않는다.
- 주석은 코드만으로 알기 어려운 선택 이유, 제약, 우회 방법을 설명할 때 작성한다.

## Verification and PR Notes

- 변경 후 `npm run lint`, `npm run format:check`, `npm run typecheck`, `npm run build`를 실행한다.
- 기능 PR에는 선택한 방식과 이유, 고려한 대안, 검증 결과와 남은 제약을 간단히 기록한다.
