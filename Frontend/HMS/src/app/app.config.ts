import { ApplicationConfig, provideZoneChangeDetection, ErrorHandler } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './coreinterceptors/auth.interceptor';
import { errorInterceptor } from './coreinterceptors/error.interceptor';

import { routes } from './app.routes';

// Global Error Handler
class GlobalErrorHandler implements ErrorHandler {
  handleError(error: any): void {
    // Log error (in production, send to error tracking service)
    console.error('Global error:', error);
    
    // Don't break the app - just log
    if (error?.rejection) {
      console.error('Unhandled promise rejection:', error.rejection);
    }
  }
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ 
      eventCoalescing: true,
      runCoalescing: true // Optimize change detection
    }),
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([authInterceptor, errorInterceptor])
    ),
    {
      provide: ErrorHandler,
      useClass: GlobalErrorHandler
    }
  ]
};
