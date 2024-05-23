import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, UrlTree } from '@angular/router';

import { Observable } from 'rxjs';

import { CookieService } from '@core/services/cookie.service';
import { ToastrService } from '@core/services/toastr.service';

@Injectable({
    providedIn: 'root'
})
export class HasRoleGuard {
    constructor(
        private cookieService: CookieService,
        private toastr: ToastrService,
        private router: Router
    ) {}

    canActivate(
        route: ActivatedRouteSnapshot
    ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        const role = this.cookieService.getCookie('role');
        const routeRole = route.data['role'];
        const isAllowed = role.includes(routeRole);

        if (isAllowed) {
            return true;
        }

        this.toastr.warn('Nincs jogosultságod megtekinteni ezt az oldalt.');
        this.router.navigate(['/signin']);
        return false;
    }
}
