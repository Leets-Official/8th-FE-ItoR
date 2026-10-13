import type { SignupErrors, SignupMethod, SignupValues } from '../model/signup';

const REQUIRED_MESSAGE = '* 반드시 입력해야하는 필수 사항입니다.';

export function getSignupDateLimit() {
  return new Intl.DateTimeFormat('sv-SE', { timeZone: 'Asia/Seoul' }).format(new Date());
}

export function validateSignup(
  values: SignupValues,
  method: SignupMethod,
  dateLimit = getSignupDateLimit(),
): SignupErrors {
  const errors: SignupErrors = {};

  if (!values.email.trim()) {
    errors.email = REQUIRED_MESSAGE;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
    errors.email = '* 올바른 이메일 형식으로 입력해주세요.';
  }

  if (method === 'email') {
    if (!values.password) errors.password = REQUIRED_MESSAGE;
    if (!values.passwordConfirmation) {
      errors.passwordConfirmation = REQUIRED_MESSAGE;
    } else if (values.password !== values.passwordConfirmation) {
      errors.passwordConfirmation = '* 비밀번호가 일치하지 않습니다.';
    }
  }

  if (!values.name.trim()) errors.name = REQUIRED_MESSAGE;

  const birthDate = values.birthDate.replace(/\s/g, '');
  if (!birthDate) {
    errors.birthDate = REQUIRED_MESSAGE;
  } else if (!/^\d{4}-\d{2}-\d{2}$/.test(birthDate) || birthDate.startsWith('0000')) {
    errors.birthDate = '* 생년월일을 YYYY - MM - DD 형식으로 입력해주세요.';
  } else {
    const date = new Date(`${birthDate}T00:00:00Z`);
    if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== birthDate) {
      errors.birthDate = '* 올바른 생년월일을 입력해주세요.';
    } else if (birthDate > dateLimit) {
      const [year, month, day] = dateLimit.split('-').map(Number);
      errors.birthDate = `* ${year}년 ${month}월 ${day}일 이전의 생년월일만 가능합니다.`;
    }
  }

  if (!values.nickname.trim()) {
    errors.nickname = REQUIRED_MESSAGE;
  } else if (Array.from(values.nickname.trim()).length > 20) {
    errors.nickname = '* 닉네임은 최대 20글자입니다.';
  }

  if (Array.from(values.introduction).length > 30) {
    errors.introduction = '* 한 줄 소개는 최대 30글자입니다.';
  }

  return errors;
}
