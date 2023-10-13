import { Component, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';
import { filter, map, Observable, tap } from 'rxjs';
import { UntilDestroy } from '@ngneat/until-destroy';
import { MessageService } from 'primeng/api';

import { AuthService } from '@core/services/auth.service';
import { shoppingCartItemsSelector } from '@core/store/selectors/shopping-cart.selectors';
import { CookieService } from '@core/services/cookie.service';
import { Category } from '@core/models/category.model';
import { selectProductCategories } from '@core/store';

@UntilDestroy({ checkProperties: true })
@Component({
  selector: 'mhd-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  isAuthenticated$: Observable<boolean>;
  categories$: Observable<Category[]>;
  itemCounter$: Observable<string>;

  isAdmin = false;

  constructor(
    private authService: AuthService,
    private messageService: MessageService,
    private store$: Store,
    private cookieService: CookieService
  ) {}

  ngOnInit(): void {
    this.categories$ = this.store$
      .select(selectProductCategories)
      .pipe(filter((categories) => !!categories));

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

  closeNavbar(): void {
    document
      .getElementsByClassName('closeable-sidebar')[0]
      .classList.add('hidden');

    document
      .getElementsByClassName('closeable-sidebar')[1]
      .classList.add('hidden');
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
