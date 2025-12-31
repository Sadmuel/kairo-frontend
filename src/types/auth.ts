export interface User {
  id: string;
  email: string;
  name: string;
  currentStreak: number;
  longestStreak: number;
  lastCompletedDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  name: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface RefreshTokenDto {
  refreshToken: string;
}
