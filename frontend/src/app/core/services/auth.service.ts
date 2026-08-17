import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthResponse, AuthUser, LoginData, RegisterData } from '../interfaces/auth.interface';
import { environment } from '../../../environments/environment.development';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { UploadProfileImageResponse } from '../interfaces/api.interface';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor() {
    this.authState.next(this.isLoggedIn());
  }
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.baseURL}/api/auth`;
  private readonly authState = new BehaviorSubject<boolean>(false);
  authState$ = this.authState.asObservable();
  private readonly userSubject = new BehaviorSubject<AuthUser | null>(this.getUserFromToken());
  user$ = this.userSubject.asObservable();
  signUp(data: RegisterData): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, data);
  }
  signIn(data: LoginData): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, data);
  }
  setToken(token: string): void {
    localStorage.setItem('token', token);
    const user = this.getUserFromToken();
    this.userSubject.next(user);
    this.authState.next(!!user);
  }
  getToken(): string {
    return localStorage.getItem('token') || '';
  }
  logout(): void {
    localStorage.removeItem('token');
    this.userSubject.next(null);
    this.authState.next(false);
  }
  private decodeToken(): JwtPayload | null {
    const token = this.getToken();
    if (!token) {
      return null;
    }
    try {
      return jwtDecode<JwtPayload>(token);
    } catch {
      return null;
    }
  }
  getUserFromToken(): AuthUser | null {
    const user = this.decodeToken();
    if (!user) {
      return null;
    }
    if (user.exp && user.exp * 1000 < Date.now()) {
      this.logout();
      return null;
    }
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      profileImage: user.profileImage,
      createdAt: user.createdAt,
    };
  }
  isLoggedIn(): boolean {
    const user = this.decodeToken();
    if (!user) {
      return false;
    }
    if (user.exp && user.exp * 1000 < Date.now()) {
      this.logout();
      return false;
    }
    return true;
  }
  getCurrentUser(): Observable<AuthUser> {
    return this.http.get<AuthUser>(`${this.apiUrl}/me`);
  }
  uploadProfileImage(file: File): Observable<UploadProfileImageResponse> {
    const formData = new FormData();
    formData.append('image', file);
    return this.http.post<UploadProfileImageResponse>(`${this.apiUrl}/upload-profile`, formData);
  }
}
