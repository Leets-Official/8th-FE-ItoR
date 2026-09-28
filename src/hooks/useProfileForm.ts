import { useState, type ChangeEvent } from 'react';
import type { ProfileFormErrors, ProfileFormValues } from '@/utils/validateProfileForm';

/**
 * 회원가입/설정 폼의 입력값과 에러를 관리한다.
 * 입력을 고치면 그 칸의 에러 문구는 바로 지워서, 사용자가 수정 중임을 알 수 있게 한다.
 */
export const useProfileForm = (initialValues: ProfileFormValues) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<ProfileFormErrors>({});

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const field = event.target.name as keyof ProfileFormValues;
    setValues((prev) => ({ ...prev, [field]: event.target.value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  /** TextField에 name/value/onChange/errorMessage를 한 번에 연결한다. */
  const getFieldProps = (field: keyof ProfileFormValues) => ({
    name: field,
    value: values[field],
    onChange: handleChange,
    errorMessage: errors[field],
  });

  return { values, setErrors, getFieldProps };
};
