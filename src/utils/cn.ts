/** 조건부 className을 공백으로 이어 붙인다. falsy 값은 무시한다. */
export const cn = (...classNames: Array<string | false | null | undefined>) =>
  classNames.filter(Boolean).join(' ');
