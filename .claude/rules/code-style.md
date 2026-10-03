# 코드 스타일 · 네이밍

## 코드 스타일

포맷과 린트는 도구가 정합니다. 커밋 시 lint-staged가 자동으로 적용하므로 수동으로 맞출 필요는 없습니다.

- **Prettier** ([.prettierrc](../../.prettierrc)): 작은따옴표, 세미콜론 사용, `printWidth: 100`. `prettier-plugin-tailwindcss`가 Tailwind 클래스 순서를 자동 정렬합니다.
- **ESLint** ([eslint.config.js](../../eslint.config.js)): `typescript-eslint` · `react-hooks` · `react-refresh` 권장 규칙. 포맷 관련 규칙은 `eslint-config-prettier`로 꺼 두었습니다.

도구가 잡지 않는 작성 규칙:

- 타입만 가져올 때는 `import type { X }` 또는 `import { x, type Y }`를 씁니다.
- 객체 형태(Props, 도메인 모델)는 `interface`, 유니언·별칭은 `type`으로 선언합니다.
  ```ts
  export type ToastType = 'negative' | 'positive';
  interface ToastProps {
    type: ToastType;
    children: ReactNode;
    className?: string;
  }
  ```
- 컴포넌트는 `function` 선언으로 작성하고, Props는 시그니처에서 구조 분해하며 기본값도 그 자리에서 지정합니다. (`function Button({ variant = 'point', ...props }: ButtonProps)`)
- 네이티브 요소를 감싸는 컴포넌트는 `ComponentProps<'button'>` 등을 확장하고 나머지 props를 `{...props}`로 전달합니다.
- 변형·상태별 클래스는 `Record<Variant, string>` 맵(`BOX_CLASS`, `TOAST_STYLE`)으로 분기하고, 조합이 복잡하면 `cva`를 사용합니다. `className`은 항상 `cn()`으로 합칩니다.
- 코드 주석은 "왜"를 적습니다. 시안 수치나 라이브러리 제약처럼 코드만 봐서 알 수 없는 이유를 남깁니다.

## 네이밍 컨벤션

| 대상                  | 규칙                                         | 예시                                                |
| --------------------- | -------------------------------------------- | --------------------------------------------------- |
| 컴포넌트              | PascalCase                                   | `PostListItem`, `IconButton`                        |
| 페이지 컴포넌트       | `{이름}Page`                                 | `BlogSearchPage`, `BlogDetailPage`                  |
| Props 타입            | `{컴포넌트}Props` (기본적으로 비공개)        | `ButtonProps`, `PaginationProps`                    |
| 변형 타입             | `{컴포넌트}Variant` · `Size` · `Type`        | `ButtonVariant`, `IconSize`, `ToastType`            |
| 도메인 타입           | PascalCase 명사                              | `PostSummary`, `PostAuthor`                         |
| 함수 · 변수           | camelCase, 함수는 동사로 시작                | `showToast`, `formatDate`, `currentPage`            |
| boolean               | `is`/`has` 접두사, 상태 prop은 형용사        | `isPrevious`, `hasThumbnail`, `pressed`, `selected` |
| 이벤트 prop · 핸들러  | prop은 `on{Event}`, 핸들러는 `handle{Event}` | `onPageChange` / `handlePageChange`                 |
| 모듈 상수 · 클래스 맵 | UPPER_SNAKE_CASE                             | `POSTS_PER_PAGE`, `MOCK_POSTS`, `PILL_CLASS`        |

## 파일 네이밍

| 대상                 | 규칙                                   | 예시                                                   |
| -------------------- | -------------------------------------- | ------------------------------------------------------ |
| 컴포넌트 파일        | 컴포넌트 이름과 같은 `PascalCase.tsx`  | `Button.tsx`, `PostListItem.tsx`                       |
| 페이지 파일          | `{이름}Page.tsx` (`pages/` 바로 아래)  | `pages/BlogSearchPage.tsx`                             |
| 컴포넌트가 아닌 모듈 | camelCase (JSX가 있으면 `.tsx`)        | `showToast.tsx`, `utils.ts`, `instance.ts`, `mocks.ts` |
| 세그먼트 폴더        | FSD 세그먼트 이름 그대로               | `ui/`, `model/`, `api/`, `lib/`, `config/`             |
| 도메인 타입 파일     | `model/types.ts`                       | `entities/post/model/types.ts`                         |
| Public API · barrel  | `index.ts`                             | `entities/post/index.ts`, `shared/ui/index.ts`         |
| 에셋(SVG·이미지)     | snake_case, 아이콘은 Figma 레이어 이름 | `error_outline.svg`, `profile_20.svg`                  |

### 슬라이스(폴더) 이름

모든 슬라이스 폴더는 **kebab-case 소문자**입니다.

| 계층       | 규칙                           | 예시                                        |
| ---------- | ------------------------------ | ------------------------------------------- |
| `widgets`  | 화면 블록 이름 (명사)          | `post-list`, `site-header`                  |
| `features` | **동사-대상** 형태의 행동 이름 | `search-post`, `write-comment`, `like-post` |
| `entities` | **단수형** 도메인 명사         | `post`, `comment`, `user`                   |

feature를 `post`처럼 명사로 짓지 않습니다. 명사 이름은 entity와 구분되지 않습니다.

- 한 파일에는 공개 컴포넌트 하나를 두는 것이 기본입니다. 그 컴포넌트에서만 쓰는 작은 하위 컴포넌트(예: `PostListItem`의 `MetaDivider`)는 같은 파일에 export 없이 둡니다.
- 밀접한 짝 컴포넌트(`PageHeader`/`CompactPageHeader`, `TextField`/`TextFieldSet`)는 한 파일에서 함께 export할 수 있습니다.
