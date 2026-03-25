import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../coreservices/auth.service';

export const profileCompleteGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }

  const user = authService.getUser();
  if (user && user.profileCompleted) {
    return true;
  }

  // Profile not completed, redirect to complete profile
  router.navigate(['/complete-profile']);
  return false;
};
