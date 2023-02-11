import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Observable, Subject, tap } from 'rxjs';
import { AuthData } from '../models/auth-data.model';
import { User } from '../models/user.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticated = false;
  private token: string;
  private authStatusListener = new Subject<boolean>();
  private tokenTimer: NodeJS.Timer;
  private userId: string;

  constructor(
    private router: Router,
    private apiService: ApiService,
    private messageService: MessageService
  ) {}

  public getToken(): string {
    return this.token;
  }

  public getIsAuthenticated(): boolean {
    return this.isAuthenticated;
  }

  public getAuthStatus$(): Observable<boolean> {
    return this.authStatusListener.asObservable();
  }

  public signupUser(newUser: User): Observable<User> {
    return this.apiService.post$('users/signup', newUser);
  }

  public loginUser(
    authData: AuthData
  ): Observable<{ success: string; token: string; expiresIn: number }> {
    return this.apiService
      .post$<{ success: string; token: string; expiresIn: number }>(
        'users/login',
        authData
      )
      .pipe(
        tap((result) => {
          this.token = result.token;
          if (this.token) {
            const expiresInDuration = result.expiresIn;
            this.setAuthenticationTimer(expiresInDuration);
            this.isAuthenticated = true;
            this.authStatusListener.next(true);
            const now = new Date();
            const expirationDate = new Date(
              now.getTime() + expiresInDuration * 1000
            );
            this.saveAuthenticationData(this.token, expirationDate);
          }
        })
      );
  }

  public saveAuthenticationData(token: string, expirationDate: Date): void {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
  }

  public clearAuthenticationData(): void {
    localStorage.clear();
  }

  public logout(): void {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    this.clearAuthenticationData();
    this.router.navigate(['/']);
    clearTimeout(this.tokenTimer);
  }

  private getAuthenticationData(): null | {
    token: string;
    expirationDate: Date;
  } {
    const token = localStorage.getItem('token');
    const expirationDate = new Date(localStorage.getItem('expiration'));

    if (!token || !expirationDate) return null;
    return {
      token,
      expirationDate
    };
  }

  public autoAuthentication() {
    const authenticationInformation = this.getAuthenticationData();
    if (!authenticationInformation) return;
    const now = new Date();
    const expiresIn =
      authenticationInformation.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = authenticationInformation.token;
      this.isAuthenticated = true;
      this.setAuthenticationTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    }
  }

  private setAuthenticationTimer(duration: number): void {
    this.tokenTimer = setTimeout(() => {
      this.messageService.add({
        severity: 'info',
        summary: 'Időkorlát lejárt',
        detail: 'Kérlek lépj be újra'
      });
      this.logout();
    }, duration * 1000);
  }
}
