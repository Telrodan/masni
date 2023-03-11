import { Component, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';
import { filter, map, Observable } from 'rxjs';
import { UntilDestroy } from '@ngneat/until-destroy';
import { MessageService } from 'primeng/api';
import {
  faChevronDown,
  faCartShopping,
  faHouse,
  faShop,
  faPalette,
  faPhone,
  faUser,
  faUserPlus,
  faRightToBracket,
  faBars,
  faXmark
} from '@fortawesome/free-solid-svg-icons';

import { AuthService } from '@core/services/auth.service';
import { shoppingCartItemsSelector } from '@core/store/selectors/shopping-cart.selectors';

@UntilDestroy({ checkProperties: true })
@Component({
  selector: 'masni-handmade-dolls-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  public isAuthenticated = false;
  public itemCounter$: Observable<number>;

  public faChevronDown = faChevronDown;
  public faCartShopping = faCartShopping;
  public faBars = faBars;
  public faXmark = faXmark;
  public faHouse = faHouse;
  public faShop = faShop;
  public faPalette = faPalette;
  public faPhone = faPhone;
  public faUser = faUser;
  public faUserPlus = faUserPlus;
  public faRightToBracket = faRightToBracket;

  constructor(
    private authService: AuthService,
    private messageService: MessageService,
    private store$: Store
  ) {}

  public ngOnInit(): void {
    this.isAuthenticated = this.authService.getIsAuthenticated();
    this.itemCounter$ = this.store$.select(shoppingCartItemsSelector).pipe(
      filter((items) => !!items),
      map((items) => items.length)
    );

    this.authService.getAuthStatus$().subscribe((response) => {
      this.isAuthenticated = response;
    });
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
