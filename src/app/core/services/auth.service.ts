import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Observable, BehaviorSubject, tap } from 'rxjs';
import { MessageService } from 'primeng/api';
import jwt_decode from 'jwt-decode';

import { ApiService } from './api.service';
import { CookieService } from './cookie.service';
import { AuthData, TokenPayload } from '@core/models/auth-data.model';
import { User } from '@core/models/user.model';
import { ApiResponse } from '@core/models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticated = false;
  private token: string;
  private tokenPayload: TokenPayload;
  private tokenTimer: NodeJS.Timer;
  private authStatusListener = new BehaviorSubject<boolean>(false);

  constructor(
    private router: Router,
    private apiService: ApiService,
    private messageService: MessageService,
    private cookieService: CookieService
  ) {}

  signup$(user: User): Observable<ApiResponse<string>> {
    return this.apiService.post<ApiResponse<string>>('auth/signup', user);
  }

  login$(authData: AuthData): Observable<ApiResponse<string>> {
    return this.apiService
      .post<ApiResponse<string>>('auth/login', authData)
      .pipe(
        tap((response) => {
          this.token = response.data;
          if (this.token) {
            this.tokenPayload = jwt_decode(response.data);
            this.setAuthData();
            this.setAuthenticationTimer(this.tokenPayload.expiresIn);
          }
        })
      );
  }

  public logout(): void {
    clearTimeout(this.tokenTimer);
    this.token = null;
    this.tokenPayload = null;
    this.cookieService.clearCookies();
    this.router.navigate(['/']);
    this.setAuthStatus(false);
  }

  public getIsAuthenticated(): boolean {
    return this.isAuthenticated;
  }

  public getAuthStatus$(): Observable<boolean> {
    return this.authStatusListener.asObservable();
  }

  private setAuthStatus(status: boolean): void {
    this.isAuthenticated = status;
    this.authStatusListener.next(this.isAuthenticated);
  }

  public forgotPassword$(email: string): Observable<ApiResponse<null>> {
    return this.apiService.post<ApiResponse<null>>('auth/forgotPassword', {
      email
    });
  }

  public resetPassword$(
    password: string,
    passwordConfirm: string,
    resetToken: string
  ): Observable<ApiResponse<string>> {
    return this.apiService
      .patch<ApiResponse<string>>(`auth/resetPassword/${resetToken}`, {
        password,
        passwordConfirm
      })
      .pipe(
        tap((response) => {
          this.token = response.data;
          if (this.token) {
            this.tokenPayload = jwt_decode(response.data);
            this.setAuthData();
            this.setAuthenticationTimer(this.tokenPayload.expiresIn);
          }
        })
      );
  }

  private setAuthData(): void {
    const currentDate = new Date();
    const expirationDate = new Date(
      currentDate.getTime() + this.tokenPayload.expiresIn * 1000
    );
    this.saveAuthenticationData(expirationDate);
    this.setAuthStatus(true);
  }

  private saveAuthenticationData(expirationDate: Date): void {
    this.cookieService.setCookie('token', this.token, 1);
    this.cookieService.setCookie('userId', this.tokenPayload.id, 1);
    this.cookieService.setCookie('role', this.tokenPayload.role, 1);
    this.cookieService.setCookie('expiration', expirationDate.toISOString(), 1);
  }

  private getAuthenticationData(): null | {
    token: string;
    userId: string;
    role: string;
    expirationDate: Date;
  } {
    const token = this.cookieService.getCookie('token');
    const userId = this.cookieService.getCookie('userId');
    const role = this.cookieService.getCookie('role');
    const expirationDate = new Date(this.cookieService.getCookie('expiration'));

    if (!userId || !expirationDate || !role) return null;
    return {
      token,
      userId,
      role,
      expirationDate
    };
  }

  public autoAuthentication(): void {
    const authenticationInformation = this.getAuthenticationData();
    if (!authenticationInformation) return;
    const currentDate = new Date();
    const expiresIn =
      authenticationInformation.expirationDate.getTime() -
      currentDate.getTime();
    if (expiresIn > 0) {
      this.setAuthenticationTimer(expiresIn / 1000);
      this.isAuthenticated = true;
      this.authStatusListener.next(this.isAuthenticated);
    }
  }

  private setAuthenticationTimer(duration: number): void {
    this.tokenTimer = setTimeout(() => {
      this.messageService.add({
        severity: 'info',
        summary: 'Időkorlát lejárt!',
        detail: 'Kérlek lépj be újra'
      });
      this.logout();
    }, duration * 1000);
  }
}
