#!/bin/bash
# 프로젝트 구조를 깨뜨리는 명령을 막는다.
input=$(cat)
cmd=$(echo "$input" | jq -r '.tool_input.command // empty')

# shadcn init은 index.css에 --primary 같은 CSS 변수를 주입해 --color-*: initial 토큰 구조와 충돌한다
if echo "$cmd" | grep -qE 'shadcn(@[^ ]+)?[[:space:]]+init'; then
  echo "차단: shadcn init 은 실행하지 않습니다. 컴포넌트는 'npx shadcn@latest add <이름>'으로 가져온 뒤 @theme 토큰으로 바꿉니다 (.claude/rules/ui-components.md)." >&2
  exit 2
fi

# 커밋·푸시 훅(lint-staged, npm run build)을 건너뛰지 않는다
if echo "$cmd" | grep -qE 'git[[:space:]]+(commit|push)[^|;&]*--no-verify'; then
  echo "차단: --no-verify 로 Husky 훅을 건너뛰지 않습니다. lint·build 오류를 먼저 고치세요." >&2
  exit 2
fi

exit 0
