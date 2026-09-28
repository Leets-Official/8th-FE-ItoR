---
paths:
  - 'src/**/*.{ts,tsx,css}'
  - 'index.html'
---

# 디자인 토큰 · 스타일링

## 스타일링

- Tailwind CSS v4를 `@tailwindcss/vite` 플러그인으로 사용합니다 ([vite.config.ts](../../vite.config.ts)).
- 별도의 `tailwind.config.js`는 없습니다 — v4는 Vite 플러그인을 통해 자체적으로 설정됩니다.
- `src/app/styles/index.css`의 `@import "tailwindcss";`로 로드되며, `main.tsx`에서 한 번만 임포트됩니다.
- 폰트·색상·타이포그래피 디자인 토큰은 같은 파일의 `@theme` 블록 **한 곳에만** 모여 있습니다.
- 웹폰트(Noto Sans KR, Roboto, Smooch)는 [index.html](../../index.html)에서 Google Fonts로 불러옵니다.

## 색상 토큰

모든 색상은 [src/app/styles/index.css](../../src/app/styles/index.css)의 `@theme` 블록 **한 곳에서만** 정의하고, 컴포넌트에서는 토큰으로 생성된 Tailwind 클래스로만 사용합니다.

- **금지**: 색상 유틸리티에 hex/rgb 값을 직접 쓰는 것 — `bg-[#f5f5f5]`, `text-[#00a1ff]`, `style={{ color: '#fff' }}` 등
- **허용**: `@theme`에 정의된 토큰 클래스 — `bg-gray-96`, `text-point`, `border-negative` 등. 투명도는 `bg-white/90`, `text-black/85`처럼 `/{0-100}` modifier로 조절합니다.
- 새 색상이 필요하면 `@theme`에 토큰을 **먼저 추가한 뒤** 사용합니다. 단, 기존 토큰과 거의 같은 색(예: 시안 속 외부 UI 키트의 파랑 `#1890ff`)이면 새 토큰을 만들지 말고 기존 토큰(`point`)으로 통일합니다.
- `@theme`에서 `--color-*: initial;`로 Tailwind 기본 팔레트를 꺼 두었으므로 `bg-red-500` 같은 기본 팔레트 클래스는 CSS가 생성되지 않습니다. (`transparent`, `current`, `inherit`은 그대로 사용 가능)

### 토큰 네이밍

| 종류   | 규칙                                                 | 예시                                         |
| ------ | ---------------------------------------------------- | -------------------------------------------- |
| 무채색 | `gray-{명도(%)}` — 명도(HSL Lightness)를 반올림한 값 | `#d9d9d9` → `gray-85`, `#f5f5f5` → `gray-96` |
| 유채색 | 역할 기반 이름                                       | `point`, `negative`, `positive`              |
| 기본색 | `white`, `black`                                     | `bg-white`, `text-black/85`                  |

## 타이포그래피 토큰

Figma 텍스트 스타일은 `@theme`의 `--text-*` 토큰(글자 크기 + 줄 높이 + 자간)과 `font-*` 굵기 클래스를 조합해 사용합니다.

| Figma 스타일 | 클래스                | 값                            |
| ------------ | --------------------- | ----------------------------- |
| 32 medium    | `text-24 font-medium` | 24px / 160% / 500             |
| 16 medium    | `text-16 font-medium` | 16px / 160% / -0.0025em / 500 |
| 14 regular   | `text-14`             | 14px / 160% / -0.005em / 400  |
| 14 light     | `text-14 font-light`  | 14px / 160% / -0.005em / 300  |
| 12 regular   | `text-12`             | 12px / 160% / 400             |
| 12 light     | `text-12 font-light`  | 12px / 160% / 300             |

- 토큰 이름은 Figma 스타일 이름이 아니라 **실제 글자 크기(px)** 기준입니다. Figma의 "32 medium"은 실제 크기가 24px이라 `text-24`입니다.
- 웹폰트는 [index.html](../../index.html)에서 쓰는 굵기만 불러옵니다.

  | 폰트                             | 불러오는 굵기   |
  | -------------------------------- | --------------- |
  | Noto Sans KR (`font-sans`, 기본) | 300 · 400 · 500 |
  | Roboto (`font-roboto`)           | 400 · 500       |
  | Smooch (`font-smooch`)           | 400             |

  목록에 없는 굵기(`font-bold`, `font-semibold` 등)를 쓰면 브라우저가 가짜 볼드로 그립니다. 새 굵기가 필요하면 `index.html`의 Google Fonts URL에 먼저 추가합니다.
