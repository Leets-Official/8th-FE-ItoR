#!/bin/bash
# 직접 수정하면 안 되는 파일을 Edit/Write로 건드리지 못하게 막는다.
input=$(cat)
file=$(echo "$input" | jq -r '.tool_input.file_path // empty')
[ -z "$file" ] && exit 0
name=$(basename "$file")

case "$file" in
  */node_modules/* | */dist/*)
    echo "차단: $file 은(는) 빌드·설치 결과물이라 직접 수정하지 않습니다." >&2
    exit 2 ;;
esac

case "$name" in
  .env.example) ;;
  .env | .env.*)
    echo "차단: $name 은(는) 비밀 값이 들어가는 파일입니다. 필요한 변수는 사용자에게 직접 추가해 달라고 요청하세요." >&2
    exit 2 ;;
  package-lock.json)
    echo "차단: package-lock.json 은 직접 수정하지 않습니다. npm install / npm uninstall 로 갱신하세요." >&2
    exit 2 ;;
esac

exit 0
