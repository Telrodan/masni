import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree
} from '@angular/router';

import { Observable } from 'rxjs';

import { AuthService } from '@core/services/auth.service';
import { ToastrService } from '@core/services/toastr.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | boolean
    | UrlTree
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree> {
    const isAuthenticated = this.authService.getIsAuthenticated();
    if (!isAuthenticated) {
      this.router.navigate(['/login']);
      this.toastr.info('Kérlek előbb jelentkezz be');
    }
    return isAuthenticated;
  }
}
