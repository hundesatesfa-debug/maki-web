export type Role = 'ADMIN' | 'OWNER' | 'RENTER';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  profilePicture: string | null;
  role: Role;
  isBanned: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: Extract<Role, 'OWNER' | 'RENTER'>;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
}
