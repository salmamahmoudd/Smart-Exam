import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { environment } from '../../../environments/environment.development';
const AUTH_ENDPOINTS = [
  `${environment.baseURL}/api/auth/login`,
  `${environment.baseURL}/api/auth/register`,
];
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const token = auth.getToken();
  const isAuthRequest = AUTH_ENDPOINTS.includes(req.url);
  if (!token || isAuthRequest) {
    return next(req);
  }
  return next(
    req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    }),
  );
};
