import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Observable, BehaviorSubject, tap } from 'rxjs';
import { MessageService } from 'primeng/api';
import jwt_decode from 'jwt-decode';

import { ApiService } from './api.service';
import { CookieService } from './cookie.service';
import { AuthData, LoginDTO, TokenPayload } from '../models/auth-data.model';
import { User } from '@core/models/user.model';

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

  public getIsAuthenticated(): boolean {
    return this.isAuthenticated;
  }

  public getAuthStatus$(): Observable<boolean> {
    return this.authStatusListener.asObservable();
  }

  public signupUser(newUser: User): Observable<User> {
    return this.apiService.post('users/signup', newUser);
  }

  public loginUser(authData: AuthData): Observable<LoginDTO> {
    return this.apiService.post<LoginDTO>('users/login', authData).pipe(
      tap((loginDTO) => {
        this.token = loginDTO.data.token;
        if (!this.token) return;
        this.tokenPayload = jwt_decode(loginDTO.data.token);
        this.setAuthData();
        this.setAuthenticationTimer(this.tokenPayload.expiresIn);
        this.isAuthenticated = true;
        this.authStatusListener.next(this.isAuthenticated);
      })
    );
  }

  public logout(): void {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(this.isAuthenticated);
    this.cookieService.clearCookies();
    this.router.navigate(['/']);
    clearTimeout(this.tokenTimer);
  }

  public forgotPassword$(email: string): Observable<null> {
    return this.apiService.post<null>('users/forgot-password', email).pipe(
      tap(() => {
        this.messageService.add({
          severity: 'success',
          summary: 'Siker!',
          detail: 'Az emailt elküldtük.'
        });
      })
    );
  }

  public resetPassword$(
    password: string,
    passwordConfirm: string,
    resetToken: string
  ): Observable<LoginDTO> {
    return this.apiService
      .patch<LoginDTO>(`users/reset-password/${resetToken}`, {
        password,
        passwordConfirm
      })
      .pipe(
        tap((loginDTO) => {
          this.token = loginDTO.data.token;
          if (!this.token) return;
          this.tokenPayload = jwt_decode(loginDTO.data.token);
          this.setAuthData();
          this.setAuthenticationTimer(this.tokenPayload.expiresIn);
          this.isAuthenticated = true;
          this.authStatusListener.next(this.isAuthenticated);
          this.router.navigate(['home']);
          this.messageService.add({
            severity: 'success',
            summary: 'Siker!',
            detail: 'Új jelszó beállítva.'
          });
        })
      );
  }

  private setAuthData(): void {
    const currentDate = new Date();
    const expirationDate = new Date(
      currentDate.getTime() + this.tokenPayload.expiresIn * 1000
    );

    this.saveAuthenticationData(expirationDate);
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
    console.log(authenticationInformation);
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
