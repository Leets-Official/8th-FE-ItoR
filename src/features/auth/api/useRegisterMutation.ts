import { useMutation } from '@tanstack/react-query';

import type { RegisterBody } from '../model/auth';
import { authApi } from './authApi';

export function useRegisterMutation() {
  return useMutation({
    mutationFn: (body: RegisterBody) => authApi.register(body).then((response) => response.data),
    retry: false,
  });
}
