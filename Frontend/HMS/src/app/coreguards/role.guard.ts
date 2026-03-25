import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../coreservices/auth.service';

export const roleGuard = (allowedRoles: string[]): CanActivateFn => {
  return (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (!authService.isAuthenticated()) {
      router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
      return false;
    }

    const user = authService.getUser();
    if (user && user.role && allowedRoles.includes(user.role)) {
      return true;
    }

    // User doesn't have required role, redirect to dashboard
    router.navigate(['/dashboard']);
    return false;
  };
};
