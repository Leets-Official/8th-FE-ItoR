export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginResponse extends AuthTokens {
  nickname: string;
  profilePicture?: string | null;
  introduction?: string | null;
  httpStatus?: string;
  responseMessage?: string;
}

export interface RegisterBody {
  email: string;
  nickname: string;
  password: string;
  birthDate: string;
  name: string;
  introduction?: string;
  profilePicture?: string;
}

export interface RegisterResponse {
  email: string;
  nickname: string;
  profilePicture?: string | null;
  introduction?: string | null;
}

export interface KakaoAuthResponse {
  httpStatus: string;
  responseMessage: string;
}
