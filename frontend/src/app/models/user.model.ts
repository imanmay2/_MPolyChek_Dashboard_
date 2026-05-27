export type UserRole = 'admin' | 'user';

export type UserStatus = 'active' | 'pending' | 'suspended';

export interface AppUser {
  id: string;
  name: string;
  email: string;
  department: string;
  role: UserRole;
  status: UserStatus;
  lastLogin: string;
  createdAt: string;
}

export interface AuthSession {
  userId: string;
  role: UserRole;
  token: string;
  loginAt: string;
}

export interface LoginPayload {
  userId: string;
  password: string;
  role: UserRole;
}

export interface UserCreatePayload {
  name: string;
  email: string;
  department: string;
  role: UserRole;
}

export interface UserUpdatePayload {
  name: string;
  email: string;
  department: string;
  role: UserRole;
  status: UserStatus;
}
