export interface AuthUser {
  id: string;
  name: string;
  email: string;
  createdAt?: string;
  role: 'user' | 'admin';
  profileImage?: string;
}

export interface AuthResponse {
  message: string;
  token?: string;
  user?: AuthUser;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}
