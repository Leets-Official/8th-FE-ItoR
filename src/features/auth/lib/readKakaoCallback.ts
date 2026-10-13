export function readKakaoCallback(params: URLSearchParams) {
  if (params.has('error')) {
    return {
      error:
        params.get('error') === 'access_denied'
          ? '카카오 인증이 취소되었습니다.'
          : '카카오 인증에 실패했습니다. 다시 인증해주세요.',
    };
  }
  const codes = params.getAll('code');
  if (codes.length !== 1 || !codes[0].trim()) {
    return { error: '카카오 인증 코드가 없습니다. 다시 인증해주세요.' };
  }
  return { code: codes[0] };
}
