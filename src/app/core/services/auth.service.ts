import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Observable, BehaviorSubject, tap, filter } from 'rxjs';
import jwt_decode from 'jwt-decode';

import { ApiService } from './api.service';
import { CookieService } from './cookie.service';
import { AuthData, ResetPasswordData } from '@core/models/auth-data.model';
import { User } from '@core/models/user.model';
import { ApiResponse } from '@core/models/api-response.model';
import { TokenPayload } from '@core/models/token-payload.model';
import { RoleType } from '@core/enums/role-type.enum';
import { ToastrService } from './toastr.service';

const ROUTE_SUFFIX = 'auth';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private isAuthSubject$ = new BehaviorSubject<boolean>(false);

    private isAuth = false;
    private token: string;
    private tokenPayload: TokenPayload;
    private tokenTimer: NodeJS.Timeout;

    constructor(
        private router: Router,
        private apiService: ApiService,
        private toastr: ToastrService,
        private cookieService: CookieService
    ) {}

    signup$(user: User): Observable<ApiResponse<string>> {
        return this.apiService.post<ApiResponse<string>>(`${ROUTE_SUFFIX}/signup`, user);
    }

    googleSignup$(token: string) {
        return this.apiService.post(`${ROUTE_SUFFIX}/googleSignup`, { token });
    }

    googleSignin$() {
        return this.apiService.get(`${ROUTE_SUFFIX}/googleSignin`);
    }

    signin$(authData: AuthData): Observable<ApiResponse<string>> {
        return this.apiService.post<ApiResponse<string>>(`${ROUTE_SUFFIX}/signin`, authData).pipe(
            filter((authDTO) => !!authDTO.data),
            tap((authDTO) => {
                this.token = authDTO.data;
                this.tokenPayload = jwt_decode(authDTO.data);
                this.setAuthData();
                this.setAuthenticationTimer(this.tokenPayload.expiresIn);
            })
        );
    }

    forgotPassword$(email: string): Observable<ApiResponse<null>> {
        return this.apiService.post<ApiResponse<null>>(`${ROUTE_SUFFIX}/forgotPassword`, {
            email
        });
    }

    resetPassword$(resetPasswordData: ResetPasswordData): Observable<ApiResponse<string>> {
        const password = {
            password: resetPasswordData.password,
            passwordConfirm: resetPasswordData.passwordConfirm
        };

        return this.apiService
            .patch<ApiResponse<string>>(
                `${ROUTE_SUFFIX}/resetPassword/${resetPasswordData.passwordResetToken}`,
                password
            )
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

    getPostcodeInformation$(postcode: number) {
        return this.apiService.get<{ city: string; county: string }>(
            `${ROUTE_SUFFIX}/postcodeInformation?postcode=${postcode}`
        );
    }

    autoAuthentication(): void {
        const authData = this.getAuthData();

        if (!authData) {
            return;
        }

        const currentDate = new Date();
        const expiresIn = authData.expirationDate.getTime() - currentDate.getTime();

        if (expiresIn > 0) {
            console.log('dasdasdsa');
            this.setAuthStatus(true);
            this.setAuthenticationTimer(expiresIn / 1000);
        }
    }

    getAuthStatus$(): Observable<boolean> {
        return this.isAuthSubject$.asObservable();
    }

    getAuthStatus(): boolean {
        return this.isAuth;
    }

    isAdmin(): boolean {
        const role = this.cookieService.getCookie('role');

        return role === RoleType.ADMIN;
    }

    logout(): void {
        clearTimeout(this.tokenTimer);
        this.token = null;
        this.tokenPayload = null;
        this.cookieService.clearCookies();
        this.router.navigate(['/']);
        this.setAuthStatus(false);
    }

    private setAuthStatus(isAuth: boolean): void {
        this.isAuth = isAuth;
        this.isAuthSubject$.next(isAuth);
    }

    private setAuthData(): void {
        const currentDate = new Date();
        const expirationDate = new Date(currentDate.getTime() + this.tokenPayload.expiresIn * 1000);
        this.saveAuthenticationData(expirationDate);
        this.setAuthStatus(true);
    }

    private saveAuthenticationData(expirationDate: Date): void {
        this.cookieService.setCookie('token', this.token, 1);
        this.cookieService.setCookie('userId', this.tokenPayload.id, 1);
        this.cookieService.setCookie('role', this.tokenPayload.role, 1);
        this.cookieService.setCookie('expiration', expirationDate.toISOString(), 1);
    }

    private getAuthData(): null | {
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

    private setAuthenticationTimer(duration: number): void {
        this.tokenTimer = setTimeout(() => {
            this.toastr.info('Időkorlát lejárt, kérlek lépj be újra');
            this.logout();
        }, duration * 1000);
    }
}
