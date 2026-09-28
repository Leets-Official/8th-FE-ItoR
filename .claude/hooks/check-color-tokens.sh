#!/bin/bash
# 색상은 @theme 토큰 클래스로만 쓴다 (.claude/rules/design-tokens.md).
# src의 .ts/.tsx에 hex·rgb·hsl 임의 색상값이 들어가면 막는다.
input=$(cat)
file=$(echo "$input" | jq -r '.tool_input.file_path // empty')

case "$file" in
  */src/*.ts | */src/*.tsx | src/*.ts | src/*.tsx) ;;
  *) exit 0 ;;
esac

# Write는 content, Edit은 new_string, MultiEdit은 edits[].new_string
text=$(echo "$input" | jq -r '[.tool_input.content, .tool_input.file_text, .tool_input.new_string, (.tool_input.edits // [] | .[].new_string)] | map(select(. != null)) | join("\n")')

matches=$(printf '%s' "$text" | grep -nE '[a-z-]+-\[(#|rgba?\(|hsla?\()|(color|background|backgroundColor|borderColor|fill|stroke)["'"'"']?[[:space:]]*:[[:space:]]*["'"'"'](#|rgba?\(|hsla?\()')
if [ -n "$matches" ]; then
  {
    echo "차단: 색상 임의값(hex/rgb/hsl)은 쓰지 않습니다. src/app/styles/index.css 의 @theme 토큰 클래스(bg-gray-96, text-point 등)를 쓰세요."
    echo "새 색이 필요하면 @theme에 토큰을 먼저 추가합니다. 발견된 부분:"
    echo "$matches"
  } >&2
  exit 2
fi

exit 0
