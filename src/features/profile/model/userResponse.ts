export interface UserResponse {
  id: number;
  email: string;
  nickname: string;
  name: string;
  birthDate: string;
  profilePicture?: string | null;
  introduction?: string | null;
}
