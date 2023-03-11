import { Component, OnDestroy, OnInit } from '@angular/core';
import { selectOrders } from '@core/store/selectors/core.selectors';

import {
  faChevronDown,
  faCartShopping,
  faHouse,
  faShop,
  faPalette,
  faPhone,
  faUser,
  faUserPlus,
  faRightToBracket
} from '@fortawesome/free-solid-svg-icons';
import { faBars, faXmark } from '@fortawesome/free-solid-svg-icons';
import { Store } from '@ngrx/store';
import { MessageService } from 'primeng/api';
import { Observable, Subject, switchMap, takeUntil } from 'rxjs';
// import coreSelectors from 'src/app/core/store/selectors';
import { Order } from 'src/app/core/models/order.model';

import { AuthService } from 'src/app/core/services/auth.service';
import { OrderService } from 'src/app/core/services/order.service';

@Component({
  selector: 'masni-handmade-dolls-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, OnDestroy {
  public isAuthenticated = false;
  public orderCounter = 0;
  private destroy = new Subject();
  public orderCounterStore: Observable<Order[]>;

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
    private orderSerivce: OrderService,
    private store$: Store
  ) {}

  public ngOnInit(): void {
    this.isAuthenticated = this.authService.getIsAuthenticated();
    // this.orderCounterStore = this.store$.select(selectOrders);
    // this.orderSerivce
    //   .getPersonalOrders()
    //   .pipe(
    //     switchMap(() => this.orderSerivce.getOrderCounterListener$()),
    //     takeUntil(this.destroy)
    //   )
    //   .subscribe((orderCounter) => {
    //     this.orderCounter = orderCounter;
    //   });

    this.authService
      .getAuthStatus$()
      .pipe(takeUntil(this.destroy))
      .subscribe((response) => {
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

  public ngOnDestroy(): void {
    this.destroy.next(null);
    this.destroy.complete();
  }
}
