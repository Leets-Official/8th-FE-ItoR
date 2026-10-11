# Gitlog API Connect Rules

Gitlog 클라이언트는 React Router 7 SPA 구조이며, 서버 상태 관리는 `@tanstack/react-query`, HTTP 클라이언트는 `axios` 기반 `api`를 사용한다. 이 문서는 API 코드 작성 규칙과 확인된 서버 계약을 다룬다.

## 기본 원칙

- 백엔드 HTTP 요청은 `src/shared/apis/client.ts`의 `api`를 통해 보낸다.
- 기본 서버 주소는 `VITE_API_BASE_URL`로 설정한다. 로컬 값은 `.env.local`에 두고 코드에 실제 주소를 하드코딩하지 않는다.
- 기능별 API 함수·Query 훅·Query Key는 `src/features/{feature}/api/`에 둔다. 인증 API는 여러 화면에서 사용해도 `src/features/auth/api/`에 둔다.
- 공통 HTTP 처리는 `src/shared/apis/`, 공통 타입은 `src/shared/types/`, 기능 전용 타입·클라이언트 상태는 해당 기능의 `model/`에 둔다.
- `lib/`에는 순수 계산·변환·검증 함수만 두고 HTTP 호출을 넣지 않는다.
- 페이지는 `src/app/routes/`에서 기능 UI와 Query 훅을 조합한다. 페이지나 UI에서 HTTP 요청을 직접 구현하지 않는다.
- 서버 데이터는 Query 캐시로 관리하고 폼·다이얼로그·로컬 이미지 미리보기는 클라이언트 상태로 관리한다. 연결한 서버 데이터를 미리보기 상태에서도 별도로 갱신하지 않는다.
- 인증 헤더와 토큰 처리는 공통 인증 관리 코드로 모은다. UI에서 storage를 직접 조작하지 않는다.
- 외부 저장소 업로드는 백엔드용 baseURL·인증 인터셉터와 분리한다.
- 연결 전에 실제 미리보기 상태·Provider·공통 클라이언트를 확인한다. 현재 공통 `api`에는 네트워크 오류 처리가 있고, 인증 헤더 주입·재발급과 기능별 API·Query 훅은 아직 구현되지 않았다.

## 폴더 위치

아래는 API 연결 시 사용할 파일 배치 예시다. 기존 `client.ts`와 Query Provider를 재사용하고, 필요한 기능 파일만 추가한다. 예시의 파일명·타입명은 현재 구현된 파일 목록을 뜻하지 않는다.

```text
src/
  shared/
    apis/
      client.ts
    types/
      api.ts
  features/
    auth/
      api/
        authApi.ts
        useLoginMutation.ts
      model/
        auth.ts
      lib/
        validateSignup.ts
      ui/
        LoginDialog.tsx
    profile/
      api/
        profileApi.ts
        profileQueries.ts
        useUserQuery.ts
      model/
        profile.ts
      lib/
        mapUserResponse.ts
      ui/
        ProfileSettingsForm.tsx
```

## API 함수 작성

API 함수는 axios 응답 본문을 반환한다. 아래 코드는 요청과 데이터 추출 위치를 보여 주는 예시이며, 사용하는 타입은 확인한 명세에 맞춰 작성한다.

- 환경변수가 비어 있으면 상대 경로 요청이 프론트 서버로 향할 수 있다. 연결 검증 전에 값과 실행 환경을 확인한다.
- baseURL과 엔드포인트 경로의 조합에 중복이 없는지 확인한다. query parameter는 axios의 `params`로 전달한다.

### 지향

```ts
// src/features/auth/api/authApi.ts
import { api } from '@/shared/apis/client';
import type { ApiResponse } from '@/shared/types/api';
import type { LoginBody, LoginResponse } from '@/features/auth/model/auth';

const authApi = {
  login: async (body: LoginBody) => {
    const response = await api.post<ApiResponse<LoginResponse>>('/auth/login', body);
    return response.data;
  },
};

export { authApi };
```

```ts
// src/features/profile/api/profileApi.ts
import { api } from '@/shared/apis/client';
import type { ApiResponse } from '@/shared/types/api';
import type { UserResponse } from '@/features/profile/model/profile';

const profileApi = {
  getMe: async () => {
    const response = await api.get<ApiResponse<UserResponse>>('/users/me');
    return response.data;
  },
};

export { profileApi };
```

### 지양

```ts
// UI에서 HTTP 요청을 직접 구현하지 않는다.
async function handleLogin(email: string, password: string) {
  const response = await axios.post('/auth/login', { email, password });
  return response.data;
}
```

```ts
// 개별 API 함수에서 서버 주소와 토큰 저장소 접근을 반복하지 않는다.
axios.get(`${import.meta.env.VITE_API_BASE_URL}/users/me`, {
  headers: {
    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
  },
});
```

위 storage 예시는 피해야 할 코드다. 실제 토큰 저장 정책은 아직 정해지지 않았다.

### 요청·응답 타입과 변환

- 확인한 JSON 응답의 공통 형태는 `{ code, message, data }`다.
- axios의 `response.data`는 응답 본문이고, 본문의 `data`는 기능별 데이터다. 두 계층을 구분한다.
- API 함수는 axios 응답 본문을 반환한다. Query 훅의 `queryFn`·`mutationFn`에서 공통 응답의 `data`를 추출해 훅 사용처에는 기능별 데이터를 전달한다. 중첩 추출을 UI마다 반복하지 않는다.
- 날짜는 요청·응답에서 문자열로 유지한다. 가입 생년월일은 `YYYY-MM-DD`로 정규화하고, 비밀번호의 공백·대소문자를 임의로 변경하지 않는다.
- 서버의 `profilePicture`와 현재 화면 모델의 `avatarUrl`, 게시물의 `nickName`·`profileUrl` 같은 차이는 기능의 순수 변환 함수에서 처리한다.
- `/users/me`의 `id`는 숫자, 현재 `User.id`는 문자열이다. 화면 모델을 유지한다면 경계에서 문자열로 변환하고 비교 기준을 통일한다.
- 게시물 id는 UUID 문자열이며 댓글 id는 상세 응답에서 숫자로 표현된다. 모든 id를 같은 타입으로 가정하지 않는다.

## React Query Hook 작성

조회는 `useQuery`, 가입·로그인·작성·수정·삭제처럼 사용자 작업으로 시작하는 변경은 `useMutation`을 사용한다. 브라우저 OAuth 이동은 해당 계약에 맞춰 별도로 처리한다.

### 지향

```ts
// src/features/profile/api/profileQueries.ts
const profileQueries = {
  all: ['profile'] as const,
  me: () => [...profileQueries.all, 'me'] as const,
};

export { profileQueries };
```

```ts
// src/features/profile/api/useUserQuery.ts
import { useQuery } from '@tanstack/react-query';

import { profileApi } from './profileApi';
import { profileQueries } from './profileQueries';

function useUserQuery(authReady: boolean) {
  return useQuery({
    queryKey: profileQueries.me(),
    queryFn: () => profileApi.getMe().then((body) => body.data),
    enabled: authReady,
  });
}

export { useUserQuery };
```

필요한 id나 인증이 준비된 경우에만 조회한다. `authReady`는 인증 복원이 끝나고 유효한 인증 정보로 내 정보를 조회할 수 있는 상태를 뜻한다. 조회 대기 상태와 실제 네트워크 로딩을 구분해 UI를 표시한다.

```ts
// src/features/auth/api/useLoginMutation.ts
import { useMutation } from '@tanstack/react-query';
import type { LoginBody } from '@/features/auth/model/auth';

import { authApi } from './authApi';

function useLoginMutation() {
  return useMutation({
    mutationFn: (body: LoginBody) => authApi.login(body).then((response) => response.data),
    retry: false,
  });
}

export { useLoginMutation };
```

로그인 훅 예시는 요청과 응답 추출만 보여 준다. 실제 로그인 연결에서는 성공 후 토큰 갱신·이전 사용자 캐시 정리·내 정보 조회를 마친 뒤 로그인 UI를 완료한다.

### 지양

```ts
// Query Key의 조건을 문자열 하나로 합치지 않는다.
useQuery({
  queryKey: [`post-${postId}-${authenticated}`],
  queryFn: () => postsApi.getById(postId),
});
```

```ts
// queryFn 안에서 화면 이동이나 다이얼로그를 조작하지 않는다.
useQuery({
  queryKey: profileQueries.me(),
  queryFn: async () => {
    const response = await profileApi.getMe();
    navigate('/mypage/settings');
    return response.data;
  },
});
```

### 변경 후 캐시 처리

- 사용자 정보 변경은 내 정보 캐시, 게시물 변경은 관련 목록·상세 캐시, 댓글 변경은 댓글을 포함한 게시물 상세 캐시를 갱신하거나 무효화한다.
- 서버가 최종 데이터를 반환하면 확인된 응답으로 `setQueryData`를 사용할 수 있다. 다시 조회해야 하는 관련 데이터는 `invalidateQueries`로 무효화한다.
- 인증 실패·입력 오류를 반복 재시도하지 않는다. 가입·작성 등 변경 요청의 자동 재시도는 중복 처리 위험과 서버 계약을 확인하고 결정한다.

## Query Key 규칙

```ts
['profile', 'me'];
['posts', 'list', { page, size, authenticated }];
['posts', 'detail', postId, { authenticated }];
```

- 배열로 구성하고 도메인명을 첫 번째 key로 둔다.
- 목록·상세를 구분하고 id·필터·페이지 등 결과를 바꾸는 조건을 포함한다.
- 필터·페이지네이션 조건은 객체로 묶는다.
- 같은 기능의 `api/`에서 Query Key factory를 만들어 재사용한다.
- 공개·인증 조회는 사용자 문맥이 달라질 수 있으므로 캐시를 구분한다. 계정 변경 시 boolean 인증 조건만으로 이전 계정 캐시를 재사용하지 않는다.

## 인증 토큰 규칙

- 인증 scheme은 HTTP Bearer다. 인증이 필요한 백엔드 요청에 access token을 `Authorization: Bearer <accessToken>`으로 전달한다.
- 로그인 응답의 `data`에는 `accessToken`, `refreshToken`, `nickname`, `profilePicture`, `introduction` 등이 있다. 전체 사용자 정보는 `/users/me`로 확인한다.
- 토큰 저장 방식은 API 계약과 보안 정책을 확인해 선택·문서화한다. 미확정 storage·cookie 방식을 임의로 고정하지 않는다.
- 토큰 읽기·쓰기·삭제는 인증 관리 코드로 모으고 UI가 storage를 직접 조작하지 않게 한다. 사용자 서버 정보는 Query 캐시로 관리한다.
- 로그인·가입·콜백·재발급 요청을 각각 구분한다. 로그인 실패를 토큰 만료로 취급하거나 모든 401을 무조건 재발급하지 않는다.
- 확인된 토큰 만료 오류에 대해서만 재발급한다. 동시 만료 요청은 하나의 재발급을 공유하고, 원래 요청의 재발급 후 재시도는 최대 한 번으로 제한한다.
- 재발급 응답에는 두 토큰이 있으므로 함께 갱신한다. 재발급 요청 자체가 재발급을 반복하지 않도록 제외한다.
- 재발급 실패·로그아웃 시 인증 정보를 정리하고 사용자별 Query 캐시를 제거하거나 초기화한다. 서버 로그아웃 API 존재·무효화 정책은 추가 확인한다.
- 인증 복원은 선택한 저장 방식에 따라 진행하고 내 정보 조회로 사용자 정보를 확인한다. 서버 사용자 정보와 로그인 UI 상태를 구분한다.
- 카카오 버튼을 누르는 것만으로 로그인 처리하지 않는다. 콜백의 기존 회원·신규 회원 구분과 `kakaoId` 전달 방식이 확인된 뒤 추가 가입 화면에 연결한다.

## 에러 처리

- 네트워크 오류 등 공통 처리는 `api`에서 담당하고 입력 오류·성공 문구·화면 이동은 기능 훅 또는 UI에서 담당한다.
- HTTP 오류는 reject 상태를 유지한다. 오류를 목 데이터나 성공 값으로 대체하지 않는다.
- HTTP 성공 응답 안의 업무 오류는 확인된 `code`·오류 계약으로 판별하고 데이터 추출 전에 실패로 처리한다. 예제의 `code: 0`을 성공 규약으로 단정하지 않는다.
- 예제의 `httpStatus: '100 CONTINUE'`, `responseMessage: 'string'`도 실제 로그인·카카오 처리 결과로 가정하지 않는다.
- `isPending`, `isFetching`, `isError`, `error`, `data`를 상황에 맞게 사용해 로딩·오류·빈 결과·성공 상태를 표시한다.
- 제출 중 중복 요청을 막고 성공 처리는 서버 응답 이후에 수행한다. 입력 오류는 해당 입력 또는 폼에 연결한다.

## 이미지 업로드

- URL 발급 → 외부 저장소 파일 전송 → 최종 URL을 가입·프로필·게시물 요청에 등록하는 흐름을 서버 계약에 맞춘다.
- 발급 API는 `fileName`을 요구하고 문자열 `data`를 반환한다. 파일명 인코딩은 `params`에 맡긴다.
- 업로드 HTTP 메서드, Content-Type 등 서명 조건, URL 만료, 최종 공개 URL 결정 방식, 인증 전 가입용 발급 가능 여부는 아직 확인되지 않았다.
- 업로드 URL을 최종 사진 URL로 그대로 등록하거나 query string을 잘라 최종 URL을 임의로 만들지 않는다.
- 저장소 요청에 백엔드 토큰을 전달하지 않는다. 크기·확장자 제한과 CORS도 계약을 확인한다.
- 업로드 실패와 업로드 후 등록 실패를 구분하고 URL 재발급·재선택·등록 재시도 등의 복구를 계약에 맞춰 처리한다.

## 확인된 서버 계약

### 명세의 기준

- 아래 계약은 2026-10-12 확인한 Leets blog 1.0.0 명세를 기준으로 한다. 실제 요청을 실행해 검증한 결과는 아니다. 명세가 바뀌면 관련 계약도 갱신한다.
- 명세 주소는 프로젝트 MD 파일에 저장하지 않는다. 추가 확인에는 대화에서 제공된 Swagger/OpenAPI 문서나 명세 파일을 사용한다.

### 엔드포인트

경로와 주요 계약만 정리한다. 본문 전체·인증 필요 여부·오류 조건은 대상 기능을 구현할 때 명세와 확인된 동작을 기준으로 결정한다. Swagger의 자물쇠 표시만으로 모든 경로가 인증을 요구한다고 판단하지 않는다.

| 기능                      | Method                | Path                                                   | 확인한 내용                                               |
| ------------------------- | --------------------- | ------------------------------------------------------ | --------------------------------------------------------- |
| 이메일 가입               | POST                  | `/auth/register`                                       | 가입 정보 JSON, 응답에 가입 사용자 정보                   |
| 이메일 로그인             | POST                  | `/auth/login`                                          | `email`, `password`; 응답에 두 토큰과 프로필 일부         |
| 토큰 재발급               | POST                  | `/auth/reissue`                                        | 본문 `refreshToken`; 응답에 `accessToken`, `refreshToken` |
| 카카오 인증 시작          | GET                   | `/auth/kakao`                                          | 설명상 redirect URL 반환; 구체적인 전달 형태는 미확정     |
| 카카오 콜백               | GET                   | `/auth/kakao/redirect`                                 | 필수 query `code`; 결과 전달 계약 추가 확인 필요          |
| 카카오 가입               | POST                  | `/auth/register-oauth`                                 | 가입 정보와 `kakaoId`; 비밀번호 필드는 없음               |
| 내 정보                   | GET                   | `/users/me`                                            | 사용자 id·이메일·프로필·이름·생년월일                     |
| 사용자 정보 수정          | PATCH                 | `/users`                                               | 요청 타입 확인 후 연결                                    |
| 닉네임·비밀번호·사진 수정 | PATCH                 | `/users/nickname`, `/users/password`, `/users/picture` | 작업별 요청 타입 확인 후 연결                             |
| 공개 게시물 상세          | GET                   | `/posts`                                               | 필수 query `postId`는 UUID 문자열; 상세에 댓글 포함       |
| 인증 게시물 상세          | GET                   | `/posts/token`                                         | 공개 상세와 별도 경로                                     |
| 공개 게시물 목록          | GET                   | `/posts/all`                                           | 필수 query `page`, `size`; 응답에 `posts`, `pageMax`      |
| 인증 게시물 목록          | GET                   | `/posts/all/token`                                     | 공개 목록과 별도 경로                                     |
| 게시물 생성·삭제·수정     | POST / DELETE / PATCH | `/posts`                                               | id의 전달 위치와 본문은 작업별 명세 확인                  |
| 댓글 생성                 | POST                  | `/comments/{postId}`                                   | path parameter로 게시물 id 전달                           |
| 댓글 삭제·수정            | DELETE / PATCH        | `/comments/{commentId}`                                | path parameter로 댓글 id 전달                             |
| 업로드 URL 발급           | GET                   | `/images/presigned-url`                                | 필수 query `fileName`; 응답 `data`는 문자열               |

### 회원가입 요청과 검증

| 필드             | 확인한 가입 스키마 제약                                             |
| ---------------- | ------------------------------------------------------------------- |
| `email`          | 필수, 이메일                                                        |
| `nickname`       | 필수, 영문·숫자만, 3~20자, `^[a-zA-Z0-9]+$`                         |
| `password`       | 필수, 8~64자, 영문·숫자·특수문자 포함; 허용 특수문자는 `@$!%*?&`    |
| `name`           | 필수, 최대 20자, 패턴 `^[가-힣]*$`; 빈 값은 프론트 필수 검사로 차단 |
| `birthDate`      | 필수, `YYYY-MM-DD`                                                  |
| `profilePicture` | 선택, 프로필 사진 URL 문자열, 최대 1000자                           |
| `introduction`   | 선택, 최대 30자                                                     |

- 비밀번호 패턴은 `^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,64}$`다. 다른 특수문자를 임의로 허용하지 않는다.
- 폼 상태와 요청 타입을 분리한다. `passwordConfirmation`은 화면 검증용이며 가입 요청에 포함하지 않는다.
- 사진의 `File`, blob URL, 미리보기 data URL을 `profilePicture`에 보내지 않는다. 업로드 후 확인된 최종 URL을 사용한다.
- 이메일·닉네임 중복 확인은 필수지만 전용 API는 확인한 목록에 없다. 엔드포인트를 만들어 추측하지 말고 가입 오류로 처리하는지, 별도 API가 있는지 확인한다.

### 게시물 데이터

- 명세 예제의 `page: 1`만으로 시작 번호를 확정하지 않으며 `pageMax`의 의미도 확인한다. 화면의 페이지 조건을 서버 규약으로 변환하는 위치를 명확히 한다.
- 게시물 `contents`의 `contentOrder`를 보존한다. `contentType` 예제인 `TEXT / IMAGE`를 그대로 전송하지 않고 실제 허용 값을 확인한다.
- 공개 상세 응답에도 `isOwner` 예제가 있으나 예제의 `true`를 실제 소유권으로 취급하지 않는다. 수정·삭제 UI에는 확인된 인증·소유권 결과를 사용한다.

## 미확정 계약

- 추가 확인: 업무 성공·실패 code, 오류 응답 구조, 토큰 만료 식별·수명·무효화, 저장 정책, 중복 확인·로그아웃 API, OAuth 콜백·로컬 redirect 설정, 업로드 계약, 페이지 번호·`pageMax` 의미, 콘텐츠 타입 값.
- 미확정 사항이 해당 작업을 막으면 필요한 항목만 확인하고, 영향 없는 타입·UI·공통 구조 작업은 진행할 수 있다. 임의의 서버 계약으로 대체하지 않는다.
- 명세 확인을 실제 회원가입·글 생성·삭제 요청 실행으로 간주하지 않는다. 실제 서버 데이터를 바꾸는 검증은 요청된 범위와 환경에서 진행한다.
