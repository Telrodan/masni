import { Component, OnInit } from '@angular/core';
import { getCategories, getMaterials, getProducts } from '@core/store';
import { getShoppingCartItems } from '@core/store/actions/shopping-cart.actions';

import { Store } from '@ngrx/store';
import { Carousel } from 'primeng/carousel';
import { filter, of, switchMap } from 'rxjs';

import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'masni-handmade-dolls-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(private authService: AuthService, private store$: Store) {
    // Allows user to scroll on carousel(mobile scroll issue fix)
    Carousel.prototype.onTouchMove = () => {};
  }

  public ngOnInit(): void {
    of(this.store$.dispatch(getCategories()))
      .pipe(
        switchMap(() => of(this.store$.dispatch(getMaterials()))),
        switchMap(() => of(this.store$.dispatch(getProducts()))),
        switchMap(() => this.authService.getAuthStatus$()),
        filter((isAuth) => isAuth),
        switchMap(() => of(this.store$.dispatch(getShoppingCartItems())))
      )
      .subscribe();
  }
}
