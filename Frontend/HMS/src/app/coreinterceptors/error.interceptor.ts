// Global Error Interceptor - Production Ready
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../coreservices/auth.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'An error occurred';

      if (error.error instanceof ErrorEvent) {
        // Client-side error
        errorMessage = error.error.message;
        console.error('Client error:', errorMessage);
      } else {
        // Server-side error
        switch (error.status) {
          case 400:
            errorMessage = error.error?.error || 'Bad request';
            break;
          case 401:
            errorMessage = 'Unauthorized. Please login again.';
            authService.logout();
            router.navigate(['/login']);
            break;
          case 403:
            errorMessage = error.error?.error || 'Access forbidden';
            if (error.error?.requiresProfileCompletion) {
              router.navigate(['/complete-profile']);
            }
            break;
          case 404:
            errorMessage = error.error?.error || 'Resource not found';
            break;
          case 429:
            errorMessage = 'Too many requests. Please try again later.';
            break;
          case 500:
            errorMessage = 'Server error. Please try again later.';
            break;
          case 503:
            errorMessage = 'Service unavailable. Please try again later.';
            break;
          default:
            errorMessage = error.error?.error || 'An unexpected error occurred';
        }
      }

      // Log error for monitoring (in production, send to error tracking service)
      if (error.status >= 500) {
        console.error('Server error:', {
          url: req.url,
          status: error.status,
          message: errorMessage
        });
      }

      return throwError(() => ({
        message: errorMessage,
        status: error.status,
        error: error.error
      }));
    })
  );
};
