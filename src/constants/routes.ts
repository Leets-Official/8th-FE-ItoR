export const ROUTES = {
  HOME: '/',
  POST_DETAIL: (postId: number | string) => `/posts/${postId}`,
  POST_WRITE: '/write',
  POST_EDIT: (postId: number | string) => `/posts/${postId}/edit`,
  SIGNUP: '/signup',
  SIGNUP_FORM: '/signup/form',
  MY_BLOG: '/my',
  PROFILE_SETTINGS: '/settings',
} as const;
