import { Component, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';
import { filter, of, switchMap } from 'rxjs';
import { Carousel } from 'primeng/carousel';

import { AuthService } from './core/services/auth.service';
import { TrackService } from '@core/services/track.service';
import {
  getCategories,
  getInspirations,
  getMaterials,
  getProducts,
  getQuestions,
  getUser,
  getShoppingCartItems
} from '@core/store';

@Component({
  selector: 'mhd-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private store$: Store,
    private trackService: TrackService
  ) {
    /**
     * Allows user to scroll on carousel (mobile scroll issue fix)
     */
    Carousel.prototype.onTouchMove = () => {};
  }

  ngOnInit(): void {
    if (sessionStorage.getItem('visit') === null) {
      const isNewVisitor = true;
      this.trackService.trackVisitor({ isNewVisitor });
    } else {
      const isNewVisitor = false;
      this.trackService.trackVisitor({ isNewVisitor });
    }

    sessionStorage.setItem('visit', 'x');

    of(this.store$.dispatch(getCategories()))
      .pipe(
        switchMap(() => of(this.store$.dispatch(getMaterials()))),
        switchMap(() => of(this.store$.dispatch(getQuestions()))),
        switchMap(() => of(this.store$.dispatch(getInspirations()))),
        switchMap(() => of(this.store$.dispatch(getProducts()))),
        switchMap(() => this.authService.getAuthStatus$()),
        filter((isAuth) => isAuth),
        switchMap(() => of(this.store$.dispatch(getUser()))),
        switchMap(() => of(this.store$.dispatch(getShoppingCartItems())))
      )
      .subscribe();
  }
}
