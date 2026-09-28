---
paths:
  - 'src/**/*.tsx'
---

# UI 컴포넌트 작성

## 변형 prop

- 컴포넌트는 named export로 작성하며, Figma 컴포넌트의 변형은 prop으로 표현합니다.
  - 종류: `variant`/`type` 문자열 유니언 (예: `ButtonVariant`, `ToastType`, `PageHeaderVariant`)
  - 크기: Figma 속성값을 그대로 쓴 숫자 유니언 `size` (예: `IconSize` = `40 | 24 | 14 | 12`, `TextFieldSize` = `32 | 14`, `BlankSize` = `64 | 32 | 20`)
  - 눌림·선택 같은 상태: `pressed`/`selected` boolean prop. 색을 `className`으로 덮어쓰지 않습니다 (아래 절 참고)

## 같은 속성의 색 클래스를 한 요소에 겹쳐 쓰지 않기

`border-gray-85`와 `border-point`처럼 같은 CSS 속성을 다루는 클래스를 한 요소에 동시에 붙이면, `className`에 적은 순서가 아니라 **Tailwind가 생성한 CSS 순서**로 적용될 값이 정해집니다. 기본/선택/비활성 등 상태별로 색 클래스를 분기해 한 속성에는 클래스가 하나만 붙도록 작성합니다. (예: [Pagination.tsx](../../src/shared/ui/Pagination.tsx))

컴포넌트는 `className`을 `cn()`(tailwind-merge)으로 합치므로 바깥에서 넘긴 색 클래스가 기존 클래스를 덮어쓰긴 하지만, 상태별 색이 컴포넌트 밖으로 흩어지므로 아래 규칙을 따릅니다.

- 컴포넌트가 이미 정하는 색(배경·글자·테두리)은 `className`으로 덮어쓰지 않습니다. 필요한 상태는 `pressed`/`selected` 같은 prop이나 새 `variant`로 컴포넌트에 추가합니다. (예: `<Button variant="white" pressed>`)
- `className`은 너비, 바깥 여백(margin), 정렬처럼 컴포넌트가 정하지 않는 속성에만 사용합니다.

## shadcn/ui

- [shadcn/ui](https://ui.shadcn.com) 방식으로 컴포넌트 코드를 `src/shared/ui/`에 두고 Figma 시안에 맞게 수정해 사용합니다. 설정은 [components.json](../../components.json)에 있습니다.
- 동작·접근성(포커스 관리, 키보드 조작, ARIA)은 Radix(`radix-ui`)가, 스타일은 `@theme` 토큰 클래스가 담당합니다.
  - `DropdownMenu`·`Menu` → Radix DropdownMenu, `Modal` → Radix AlertDialog, 토스트 → sonner(`<Toaster />` + `showToast()`), `Button` → cva + `asChild`(Slot)
- `npx shadcn@latest init`은 실행하지 않습니다 — `index.css`에 shadcn 전용 CSS 변수(`--primary` 등)를 주입해 `--color-*: initial` 토큰 구조와 충돌합니다.
- `npx shadcn@latest add <컴포넌트>`로 새 컴포넌트를 가져오면 `bg-primary`, `text-muted-foreground` 같은 shadcn 색 클래스를 `@theme` 토큰 클래스로 바꾼 뒤 사용합니다. 아이콘도 lucide 대신 [Icon](../../src/shared/ui/Icon.tsx)으로 교체합니다.
- 새 공용 컴포넌트는 `src/shared/ui/index.ts`에 등록하고, 모든 변형·크기·상태를 [ShowcasePage](../../src/pages/ShowcasePage.tsx)에 추가합니다.
- `className`은 항상 `cn()`으로 합칩니다. 커스텀 글자 크기 토큰(`text-12` 등)을 새로 추가하면 [utils.ts](../../src/shared/lib/utils.ts)의 `extendTailwindMerge` 설정에도 추가해야 글자색 클래스와 충돌로 오인되지 않습니다.

## 아이콘

- SVG 파일은 `src/shared/assets/icons/`에 두고, [Icon.tsx](../../src/shared/ui/Icon.tsx)의 `ICONS`에 등록한 이름(`IconName`)으로 사용합니다. 예: `<Icon name="create" size={24} />`
- Icon은 SVG를 CSS mask로 칠하므로 **SVG 안의 `fill` 색은 무시되고, 부모의 글자색(`currentColor`)을 따릅니다.** 색은 부모 요소나 Icon의 `className`에 `text-*` 토큰으로 지정합니다.
- 새 아이콘은 Figma 레이어 이름과 같은 파일명(예: `error_outline.svg`)으로, 정사각형 viewBox(대부분 24×24, Pagination 화살표는 12×12)의 SVG로 추가한 뒤 `ICONS`에 등록합니다. 표시 크기는 `size` prop이 정하므로 SVG의 `width`/`height`/`id`와 주석은 지웁니다.
- `size={40}`은 24px 아이콘 주위에 여백을 더한 40px 영역입니다 (IconButton에서 사용).
