import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';

import { Observable } from 'rxjs';

import { AuthService } from '@core/services/auth.service';
import { ToastrService } from '@core/services/toastr.service';

@Injectable()
export class AuthGuard {
    constructor(
        private authService: AuthService,
        private router: Router,
        private toastr: ToastrService
    ) {}
    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
        const isAuthenticated = this.authService.getAuthStatus();
        if (isAuthenticated) {
            return isAuthenticated;
        }

        this.router.navigate(['/auth/signin']);
        this.toastr.info('Kérlek előbb jelentkezz be.');

        return isAuthenticated;
    }
}
