import type { RegisterBody } from '../model/auth';
import type { SignupValues } from '../model/signup';

export function createRegisterBody(values: SignupValues): RegisterBody {
  return {
    email: values.email.trim(),
    nickname: values.nickname.trim(),
    password: values.password,
    birthDate: values.birthDate.replace(/\s/g, ''),
    name: values.name.trim(),
    introduction: values.introduction,
  };
}
