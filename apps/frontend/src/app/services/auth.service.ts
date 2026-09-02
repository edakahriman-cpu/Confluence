import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';

export interface User {
  id: number;
  username: string;
  email: string | null;
  isActive: boolean;
  isDeleted: boolean;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

export interface Profile {
  sub: number;
  username: string;
}

export interface ForgotPasswordResponse {
  message: string;
  resetToken: string;
}

export interface ApiError {
  message?: string | string[];
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly tokenKey = 'confluence_access_token';
  private readonly userKey = 'confluence_user';
  readonly currentUser = signal<User | null>(this.readUser());

  constructor(private readonly http: HttpClient) {}

  login(username: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>('/auth/login', { username, password }).pipe(
      tap((response) => this.saveSession(response)),
    );
  }

  register(username: string, email: string, password: string): Observable<AuthResponse> {
    const payload = email ? { username, email, password } : { username, password };
    return this.http.post<AuthResponse>('/auth/register', payload).pipe(
      tap((response) => this.saveSession(response)),
    );
  }

  forgotPassword(username: string): Observable<ForgotPasswordResponse> {
    return this.http.post<ForgotPasswordResponse>('/auth/forgot-password', { username });
  }

  getMe(): Observable<Profile> {
    return this.http.get<Profile>('/auth/me');
  }

  get token(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  get isAuthenticated(): boolean {
    return !!this.token;
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    this.currentUser.set(null);
  }

  private saveSession(response: AuthResponse): void {
    localStorage.setItem(this.tokenKey, response.accessToken);
    localStorage.setItem(this.userKey, JSON.stringify(response.user));
    this.currentUser.set(response.user);
  }

  private readUser(): User | null {
    try {
      const storedUser = localStorage.getItem(this.userKey);
      return storedUser ? (JSON.parse(storedUser) as User) : null;
    } catch {
      return null;
    }
  }
}
