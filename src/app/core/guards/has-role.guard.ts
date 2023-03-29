import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
  UrlTree
} from '@angular/router';
import { CookieService } from '@core/services/cookie.service';
import { ToastrService } from '@core/services/toastr.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HasRoleGuard implements CanActivate {
  constructor(
    private cookieService: CookieService,
    private toastr: ToastrService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
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
      this.toastr.info('Info', 'Nincs jogosultságod ehhez az oldalhoz');
      console.log('lol');
      return false;
    }
  }
}
