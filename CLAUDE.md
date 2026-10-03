# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요

이 저장소는 Leets 8기 프론트엔드 부트캠프 미션 저장소("8th-FE-ItoR")입니다. Vite + React + TypeScript + Tailwind CSS v4 기반이며, 폴더 구조는 `app` · `pages` · `features`(도메인별) · `shared`로 나눈 도메인 기반 구조입니다. 디자인 시안을 바탕으로 공용 UI 컴포넌트(`src/shared/ui/`)와 페이지(`src/pages/`)를 구현하는 단계입니다. 라우트는 `src/app/router.tsx`에서 설정하며, `/`는 블로그 찾기 페이지입니다.

## 커맨드

- `npm run dev` — Vite 개발 서버 실행 (HMR 포함)
- `npm run build` — 타입 체크(`tsc -b`) 후 프로덕션 빌드(`vite build`)
- `npm run lint` — 저장소 전체 ESLint 검사 (`eslint .`)
- `npm run format` — Prettier로 전체 포맷팅
- `npm run preview` — 프로덕션 빌드 결과를 로컬에서 미리보기

아직 테스트 러너는 설정되어 있지 않습니다. Husky 훅이 커밋 시 lint-staged(`eslint --fix` / `prettier --write`)를, push 시 `npm run build`를 자동 실행합니다.

## 규칙 파일 (`.claude/rules/`)

주제별 규칙은 `.claude/rules/`에 있습니다. `paths`가 없는 파일은 항상 로드되고, `paths`가 있는 파일은 해당 경로의 파일을 다룰 때 로드됩니다.

| 파일               | 내용                                                        | 로드 시점                                     |
| ------------------ | ----------------------------------------------------------- | --------------------------------------------- |
| `architecture.md`  | 엔트리, 경로 별칭, 폴더 구조, 의존 방향, Public API, 라우팅 | 항상                                          |
| `code-style.md`    | 코드 스타일, 네이밍, 파일·도메인 폴더 이름                  | 항상                                          |
| `data-flow.md`     | 상태 소유, 계층별 데이터 흐름                               | `src/**/*.{ts,tsx}` 작업 시                   |
| `design-tokens.md` | Tailwind 설정, 색상·타이포그래피 토큰                       | `src/**/*.{ts,tsx,css}`, `index.html` 작업 시 |
| `ui-components.md` | 변형 prop, 색 클래스 덮어쓰기 금지, shadcn/ui, 아이콘       | `src/**/*.tsx` 작업 시                        |
| `api.md`           | axios 인스턴스, TanStack Query, 환경 변수                   | `api/`·`app/`·`.env*` 작업 시                 |

- API 연동을 시작할 때는 관련 파일을 열기 전이라도 `.claude/rules/api.md`를 먼저 읽습니다.
- 규칙 파일은 한 파일에 한 주제만 다루고, 코드 블록(예시)을 제외하고 150줄을 넘기지 않습니다. 넘으면 주제별로 파일을 나눕니다.

## 스킬 · 훅

- **스킬** (`.claude/skills/`, 호출 시 로드): `/pr-description` PR 제목·본문 초안 (직접 호출만)
- **훅** (`.claude/hooks/`, [settings.json](.claude/settings.json)에 등록, 강제 차단)
  - `protect-files.sh` — `.env*`(`.env.example` 제외), `package-lock.json`, `dist/`, `node_modules/` 직접 수정 차단
  - `check-color-tokens.sh` — `src`의 `.ts`/`.tsx`에 hex·rgb·hsl 색상 임의값 차단
  - `guard-bash.sh` — `shadcn init`, git 훅 우회 옵션 차단

## 협업 규칙

- 브랜치: `{이름}/{숫자}주차`에서 작업하고 `{이름}/main`으로 PR을 올립니다.
- 커밋: `feat` · `fix` · `chore` · `refactor` · `docs` 태그 접두사를 붙입니다. (예: `feat: 로그인 폼 UI 구현`)
- PR·이슈 제목과 본문, 제출 체크리스트는 `.github/` 템플릿([PR](.github/PULL_REQUEST_TEMPLATE.md), [이슈](.github/ISSUE_TEMPLATE/mission.md))을 따릅니다.
