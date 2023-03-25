import { Component, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';
import { filter, map, Observable, tap } from 'rxjs';
import { UntilDestroy } from '@ngneat/until-destroy';
import { MessageService } from 'primeng/api';

import { AuthService } from '@core/services/auth.service';
import { shoppingCartItemsSelector } from '@core/store/selectors/shopping-cart.selectors';
import { CookieService } from '@core/services/cookie.service';

@UntilDestroy({ checkProperties: true })
@Component({
  selector: 'masni-handmade-dolls-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  public isAuthenticated$: Observable<boolean>;
  public itemCounter$: Observable<string>;
  isAdmin = false;

  constructor(
    private authService: AuthService,
    private messageService: MessageService,
    private store$: Store,
    private cookieService: CookieService
  ) {}

  public ngOnInit(): void {
    this.isAuthenticated$ = this.authService.getAuthStatus$().pipe(
      tap(() => {
        const role = this.cookieService.getCookie('role');
        this.isAdmin = role === 'admin' ? true : false;
      })
    );

    this.itemCounter$ = this.store$.select(shoppingCartItemsSelector).pipe(
      filter((items) => !!items),
      map((items) => items.length.toString())
    );
  }

  public closeNavbar(): void {
    document.getElementsByClassName('sidebar')[0].classList.add('hidden');
  }

  public onLogout(): void {
    this.closeNavbar();
    this.authService.logout();
    this.messageService.add({
      severity: 'success',
      summary: 'Siker!',
      detail: 'Sikeres kilépés, átirányítva a főoldalra'
    });
  }
}
