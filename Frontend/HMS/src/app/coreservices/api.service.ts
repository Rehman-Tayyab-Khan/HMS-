import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpContext } from '@angular/common/http';
import { Observable, throwError, timer, OperatorFunction } from 'rxjs';
import { map, catchError, retry, timeout, retryWhen, delayWhen, take, concat } from 'rxjs/operators';
import { environment } from '../../environments/environment';

// Standard API Response Interface
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: any[];
  timestamp?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = environment.apiUrl || 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    });
  }

  private handleResponse<T>(response: ApiResponse<T>): T {
    if (response.success) {
      // If data exists, return it; otherwise return the response itself (for backward compatibility)
      return response.data !== undefined ? response.data : response as any;
    }
    throw new Error(response.message || 'Unknown error');
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = error.error.message;
    } else {
      // Server-side error
      if (error.error && error.error.message) {
        errorMessage = error.error.message;
      } else {
        errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
      }
    }
    
    return throwError(() => new Error(errorMessage));
  }

  // Retry logic with exponential backoff
  private retryWithBackoff<T>(maxRetries = 2, delay = 1000): OperatorFunction<T, T> {
    return retryWhen((errors: Observable<any>) =>
      errors.pipe(
        delayWhen((error: any, index: number) => {
          // Don't retry on 4xx errors (except 429)
          if (error?.status >= 400 && error?.status < 500 && error?.status !== 429) {
            return throwError(() => error);
          }
          return timer(Math.min(delay * Math.pow(2, index), 10000));
        }),
        take(maxRetries),
        concat(throwError(() => new Error('Request failed after retries')))
      )
    );
  }

  get<T>(endpoint: string, options: { timeout?: number; retries?: number } = {}): Observable<T> {
    const timeoutMs = options.timeout || 30000; // 30 seconds default
    const retries = options.retries ?? 2;

    return this.http.get<ApiResponse<T>>(`${this.apiUrl}${endpoint}`, { 
      headers: this.getHeaders(),
      withCredentials: environment.production
    }).pipe(
      timeout(timeoutMs),
      this.retryWithBackoff<ApiResponse<T>>(retries),
      map((response: ApiResponse<T>) => this.handleResponse<T>(response)),
      catchError(this.handleError)
    );
  }

  post<T>(endpoint: string, data: any, options: { timeout?: number; retries?: number } = {}): Observable<T> {
    const timeoutMs = options.timeout || 30000;
    const retries = options.retries ?? 1; // POST requests: fewer retries

    return this.http.post<ApiResponse<T>>(`${this.apiUrl}${endpoint}`, data, { 
      headers: this.getHeaders(),
      withCredentials: environment.production
    }).pipe(
      timeout(timeoutMs),
      this.retryWithBackoff<ApiResponse<T>>(retries),
      map((response: ApiResponse<T>) => this.handleResponse<T>(response)),
      catchError(this.handleError)
    );
  }

  put<T>(endpoint: string, data: any, options: { timeout?: number; retries?: number } = {}): Observable<T> {
    const timeoutMs = options.timeout || 30000;
    const retries = options.retries ?? 1;

    return this.http.put<ApiResponse<T>>(`${this.apiUrl}${endpoint}`, data, { 
      headers: this.getHeaders(),
      withCredentials: environment.production
    }).pipe(
      timeout(timeoutMs),
      this.retryWithBackoff<ApiResponse<T>>(retries),
      map((response: ApiResponse<T>) => this.handleResponse<T>(response)),
      catchError(this.handleError)
    );
  }

  delete<T>(endpoint: string, options: { timeout?: number; retries?: number } = {}): Observable<T> {
    const timeoutMs = options.timeout || 30000;
    const retries = options.retries ?? 1;

    return this.http.delete<ApiResponse<T>>(`${this.apiUrl}${endpoint}`, { 
      headers: this.getHeaders(),
      withCredentials: environment.production
    }).pipe(
      timeout(timeoutMs),
      this.retryWithBackoff<ApiResponse<T>>(retries),
      map((response: ApiResponse<T>) => this.handleResponse<T>(response)),
      catchError(this.handleError)
    );
  }
}
