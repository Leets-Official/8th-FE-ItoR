---
name: pr-description
description: 현재 브랜치의 변경 사항으로 .github PR 템플릿에 맞는 PR 제목과 본문 초안을 작성한다. PR을 직접 만들지는 않는다.
disable-model-invocation: true
argument-hint: '[주차 숫자(선택)]'
---

현재 브랜치의 PR 제목과 본문 **초안**을 작성합니다. PR 생성·push는 하지 않습니다. 인자: $ARGUMENTS

1. **브랜치 확인** — `git branch --show-current`. 규칙은 `{이름}/{숫자}주차` → base `{이름}/main`입니다. 형식이 다르면 사용자에게 알립니다.
2. **변경 수집** — `git log {이름}/main..HEAD --oneline`, `git diff {이름}/main...HEAD --stat`, 필요한 파일의 diff를 읽습니다. base 브랜치가 없으면 사용자에게 base를 묻습니다.
3. **템플릿 읽기** — `.github/PULL_REQUEST_TEMPLATE.md`의 섹션 순서를 그대로 따릅니다.
4. **작성**
   - 제목: `[N주차] 이름/[type] 작업 내용` (주차·이름은 브랜치명에서, type은 커밋 태그 중 대표값)
   - 1. 구현 범위: 커밋·diff 기준 체크박스
   - 2. 핵심 변경 사항: 파일 목록이 아니라 "무엇을 왜" 중심으로 3~6줄
   - 3. 실행 및 검증: `npm run lint`/`npm run build`를 직접 실행해 결과를 적고, 스크린샷 자리는 `[이미지 첨부: …]`로 남김
   - 5. 추가한 라이브러리: `git diff {base}...HEAD -- package.json`의 dependencies 변화
   - 템플릿의 HTML 주석(`<!-- -->`)은 지웁니다.
5. **출력** — 제목과 본문을 각각 코드 블록으로 보여줘서 바로 복사할 수 있게 합니다. 남은 확인 사항(스크린샷, Reviewer 지정)을 마지막에 한 줄로 알립니다.
