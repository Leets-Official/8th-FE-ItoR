import { validateSignup } from '@/features/auth/lib/validateSignup';
import type { SignupMethod } from '@/features/auth/model/signup';

import type { ProfileDraft } from '../model/profile';

export function validateProfile(values: ProfileDraft, method: SignupMethod) {
  const unchangedPassword = !values.password && !values.passwordConfirmation;
  return validateSignup(
    {
      ...values,
      password: unchangedPassword ? 'unchanged' : values.password,
      passwordConfirmation: unchangedPassword ? 'unchanged' : values.passwordConfirmation,
    },
    method,
  );
}
