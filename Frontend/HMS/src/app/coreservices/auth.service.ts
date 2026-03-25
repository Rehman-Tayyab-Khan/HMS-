import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap, catchError, of, map } from 'rxjs';
import { ApiService } from './api.service';

export interface User {
  id: string;
  email: string;
  role?: string;
  staffId?: string;
  staffInfo?: any;
  profileCompleted?: boolean;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(this.getUserFromStorage());
  public currentUser$ = this.currentUserSubject.asObservable();
  private tokenCheckInterval: any;

  constructor(
    private apiService: ApiService,
    private router: Router
  ) {
    // Auto-refresh user data if token exists
    this.initializeAuth();
  }

  private initializeAuth(): void {
    const token = this.getToken();
    if (token && this.isAuthenticated()) {
      // Verify token is still valid by fetching current user
      this.refreshUserData().subscribe({
        next: () => {
          this.startTokenCheck();
        },
        error: () => {
          // Token is invalid, clear auth
          this.clearAuth();
        }
      });
    }
  }

  login(email: string, password: string): Observable<LoginResponse> {
    return this.apiService.post<{ token: string; user: User }>('/auth/login', { email, password }).pipe(
      tap(response => {
        this.setToken(response.token);
        this.setUser(response.user);
        this.startTokenCheck();
      }),
      map(response => ({ 
        token: response.token, 
        user: response.user 
      }))
    );
  }

  register(data: any): Observable<LoginResponse> {
    return this.apiService.post<{ token: string; user: User }>('/auth/register', data).pipe(
      tap(response => {
        console.log('response', response);
        this.setToken(response.token);
        this.setUser(response.user);
        this.startTokenCheck();
      }),
      map(response => ({ 
        token: response.token, 
        user: response.user 
      }))
    );
  }

  getCurrentUser(): Observable<{ user: User } | null> {
    return this.apiService.get<{ user: User }>('/auth/me').pipe(
      tap((response: { user: User }) => {
        if (response && response.user) {
          this.setUser(response.user);
        }
      }),
      map(response => ({ user: response.user })),
      catchError((error: any) => {
        if (error.status === 401) {
          this.clearAuth();
        }
        return of(null);
      })
    );
  }

  refreshUserData(): Observable<{ user: User } | null> {
    return this.getCurrentUser();
  }

  changePassword(data: ChangePasswordData): Observable<any> {
    return this.apiService.post('/auth/change-password', data);
  }

  completeProfile(data: any): Observable<LoginResponse> {
    return this.apiService.post<{ token: string; user: User }>('/auth/complete-profile', data).pipe(
      tap(response => {
        this.setToken(response.token);
        this.setUser(response.user);
      }),
      map(response => ({ 
        token: response.token, 
        user: response.user 
      }))
    );
  }

  updateProfile(data: any): Observable<{ user: User }> {
    return this.apiService.put<{ user: User }>('/auth/profile', data).pipe(
      tap((response: { user: User }) => {
        if (response && response.user) {
          this.setUser(response.user);
        }
      }),
      map(response => ({ user: response.user }))
    );
  }

  setToken(token: string): void {
    localStorage.setItem('token', token);
    localStorage.setItem('tokenTimestamp', Date.now().toString());
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  setUser(user: User): void {
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  getUser(): User | null {
    return this.currentUserSubject.value;
  }

  private getUserFromStorage(): User | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  private clearAuth(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('tokenTimestamp');
    this.currentUserSubject.next(null);
    this.stopTokenCheck();
  }

  logout(): void {
    // Optionally call logout endpoint
    this.apiService.post('/auth/logout', {}).subscribe({
      error: () => {
        // Even if logout fails, clear local auth
      },
      complete: () => {
        this.clearAuth();
        this.router.navigate(['/login']);
      }
    });
    
    // Clear immediately for better UX
    this.clearAuth();
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;

    // Check if token is expired (basic check)
    const tokenTimestamp = localStorage.getItem('tokenTimestamp');
    if (tokenTimestamp) {
      const tokenAge = Date.now() - parseInt(tokenTimestamp);
      const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
      if (tokenAge > maxAge) {
        this.clearAuth();
        return false;
      }
    }

    return true;
  }

  hasRole(role: string): boolean {
    const user = this.getUser();
    return user?.role === role;
  }

  hasAnyRole(roles: string[]): boolean {
    const user = this.getUser();
    return user && user.role ? roles.includes(user.role) : false;
  }

  private startTokenCheck(): void {
    // Check token validity every 5 minutes
    this.stopTokenCheck();
    this.tokenCheckInterval = setInterval(() => {
      if (this.isAuthenticated()) {
        this.refreshUserData().subscribe({
          error: () => {
            this.clearAuth();
            this.router.navigate(['/login']);
          }
        });
      }
    }, 5 * 60 * 1000); // 5 minutes
  }

  private stopTokenCheck(): void {
    if (this.tokenCheckInterval) {
      clearInterval(this.tokenCheckInterval);
      this.tokenCheckInterval = null;
    }
  }
}
