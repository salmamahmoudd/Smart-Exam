export interface JwtPayload {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  exp: number;
  profileImage?: string;
  createdAt?: string;
}
