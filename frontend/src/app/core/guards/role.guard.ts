import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
export const roleGuard: CanActivateFn = (route) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const user = auth.getUserFromToken();
  const allowedRoles = route.data?.['roles'] ?? [];
  if (!user) {
    return router.createUrlTree(['/auth/login']);
  }
  if (allowedRoles.includes(user.role)) {
    return true;
  }
  return router.createUrlTree(['/dashboard']);
};
