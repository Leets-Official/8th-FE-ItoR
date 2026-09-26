# ItoR 프로젝트 지침

ItoR은 React와 TypeScript로 구현하는 반응형 웹 애플리케이션입니다.

## 지침 적용 순서

1. 사용자의 최신 요청
2. 이 `AGENTS.md`
3. 현재 작업에 관련된 `codex/rules/` 문서

작업을 시작하기 전에 현재 코드와 변경 사항을 확인하고, 필요한 규칙만 읽습니다.

- 구조, 의존성, 라우팅: `codex/rules/architecture.md`
- 이름, 파일 구성, 주석: `codex/rules/conventions.md`
- React, TypeScript, 스타일 작성: `codex/rules/code-style.md`
- 브랜치, 커밋, PR: `codex/rules/git.md`

## 핵심 원칙

- 사용자가 작성한 변경 사항과 현재 작업 범위 밖의 코드를 임의로 수정하지 않습니다.
- 기존 디자인 토큰, 공통 컴포넌트, 반응형 기준을 먼저 재사용합니다.
- `src/app/routeTree.gen.ts`는 생성 파일이므로 직접 수정하지 않습니다.
- 구조나 컨벤션을 바꾸기 전에 기존 구현과 관련 설정을 확인합니다.
- 작업 중 반복해서 필요한 규칙이나 PR 리뷰에서 확인된 규칙은 관련 문서에 반영합니다.
- 오래되었거나 서로 충돌하는 규칙은 발견한 작업에서 함께 정리합니다.

## 주요 명령어

- 설치: `pnpm install`
- 개발 서버: `pnpm dev`
- 타입 검사: `pnpm typecheck`
- 린트: `pnpm lint`
- 빌드: `pnpm build`
- 포맷 검사: `pnpm format:check`

변경 범위에 맞는 검사를 실행하고, 실패 원인과 미검증 항목을 명확히 보고합니다.

## Git 작업

커밋이나 PR 작업 전에는 `codex/rules/git.md`를 읽습니다. 커밋 메시지는 한국어로 작성하고,
실제 커밋 전 사용자에게 메시지를 확인받습니다.
