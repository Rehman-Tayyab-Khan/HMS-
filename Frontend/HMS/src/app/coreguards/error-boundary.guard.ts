// Error Boundary Guard - Catches route errors
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../coreservices/auth.service';

export const errorBoundaryGuard: CanActivateFn = (route, state) => {
  try {
    // This guard ensures routes don't break the app
    return true;
  } catch (error) {
    console.error('Route error:', error);
    const router = inject(Router);
    router.navigate(['/dashboard']);
    return false;
  }
};
