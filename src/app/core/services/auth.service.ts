import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Observable, BehaviorSubject, tap, TimeoutConfig } from 'rxjs';
import { MessageService } from 'primeng/api';

import { CookieService } from './cookie.service';
import { ApiService } from './api.service';
import { AuthData } from '../models/auth-data.model';
import { User } from '../models/user.model';
import { OrderService } from './order.service';

interface LoginData {
  token: string;
  userId: string;
  expiresIn: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticated = false;
  private token: string;
  private userId: string;
  private tokenTimer: NodeJS.Timer;
  private authStatusListener = new BehaviorSubject<boolean>(false);

  constructor(
    private router: Router,
    private apiService: ApiService,
    private messageService: MessageService,
    private cookieService: CookieService,
    private orderSerivce: OrderService
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

  public loginUser(authData: AuthData): Observable<LoginData> {
    return this.apiService.post<LoginData>('users/login', authData).pipe(
      tap((result) => {
        this.token = result.token;
        if (this.token) {
          const expiresInDuration = result.expiresIn;
          this.userId = result.userId;
          this.isAuthenticated = true;
          this.authStatusListener.next(this.isAuthenticated);
          this.setAuthenticationTimer(expiresInDuration);
          this.setAuthData(expiresInDuration);
          this.orderSerivce.setUserOrdersStore();
        }
      })
    );
  }

  private setAuthData(expiresInDuration: number): void {
    const currentDate = new Date();
    const expirationDate = new Date(
      currentDate.getTime() + expiresInDuration * 1000
    );
    this.saveAuthenticationData(expirationDate);
  }

  private saveAuthenticationData(expirationDate: Date): void {
    this.cookieService.setCookie('token', this.token, 1);
    this.cookieService.setCookie('userId', this.userId, 1);
    this.cookieService.setCookie('expiration', expirationDate.toISOString(), 1);
  }

  public logout(): void {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(this.isAuthenticated);
    this.cookieService.clearCookies();
    this.router.navigate(['/']);
    clearTimeout(this.tokenTimer);
  }

  private getAuthenticationData(): null | {
    token: string;
    expirationDate: Date;
  } {
    const token = this.cookieService.getCookie('token');
    const expirationDate = new Date(this.cookieService.getCookie('expiration'));

    if (!token || !expirationDate) return null;
    return {
      token,
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
      this.token = authenticationInformation.token;
      this.isAuthenticated = true;
      this.authStatusListener.next(this.isAuthenticated);
      this.setAuthenticationTimer(expiresIn / 1000);
    }

    this.orderSerivce.setUserOrdersStore();
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
