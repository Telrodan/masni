import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, UrlTree } from '@angular/router';

import { Observable } from 'rxjs';

import { CookieService } from '@core/services/cookie.service';
import { ToastrService } from '@core/services/toastr.service';

@Injectable({
  providedIn: 'root'
})
export class HasRoleGuard implements CanActivate {
  constructor(
    private cookieService: CookieService,
    private toastr: ToastrService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const role = this.cookieService.getCookie('role');
    const isAllowed = role.includes(route.data['role']);

    if (isAllowed) {
      return true;
    } else {
      this.toastr.warn('Nincs jogosultságod ehhez az oldalhoz');
      return false;
    }
  }
}
