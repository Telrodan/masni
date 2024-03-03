import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  OnInit,
  ViewEncapsulation
} from '@angular/core';

import { Store } from '@ngrx/store';
import { filter, of, switchMap, tap } from 'rxjs';
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
import { routeTransitionAnimation } from './route-transition.animations';
import {
  ChildrenOutletContexts,
  NavigationEnd,
  Router,
  RouterOutlet
} from '@angular/router';

import AOS from 'aos';

@Component({
  selector: 'mhd-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [routeTransitionAnimation]
})
export class AppComponent implements OnInit {
  @HostBinding('class.nyk-app') hostClass = true;

  isAdminPage = false;

  constructor(
    private router: Router,
    private contexts: ChildrenOutletContexts,
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
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        tap((event: NavigationEnd) => {
          if (event.url.startsWith('/admin')) {
            this.isAdminPage = true;
          } else {
            this.isAdminPage = false;
          }
        })
      )
      .subscribe();
    // if (sessionStorage.getItem('visit') === null) {
    //   const isNewSession = true;
    //   this.trackService.trackVisitor(isNewSession);
    // } else {
    //   const isNewSession = false;
    //   this.trackService.trackVisitor(isNewSession);
    // }
    // sessionStorage.setItem('visit', 'x');
    // of(this.store$.dispatch(getCategories()))
    //   .pipe(
    //     switchMap(() => of(this.store$.dispatch(getMaterials()))),
    //     switchMap(() => of(this.store$.dispatch(getQuestions()))),
    //     switchMap(() => of(this.store$.dispatch(getInspirations()))),
    //     switchMap(() => of(this.store$.dispatch(getProducts()))),
    //     switchMap(() => this.authService.getAuthStatus$()),
    //     filter((isAuth) => isAuth),
    //     switchMap(() => of(this.store$.dispatch(getUser()))),
    //     switchMap(() => of(this.store$.dispatch(getShoppingCartItems())))
    //   )
    //   .subscribe();

    AOS.init({
      mobile: true
    });
  }

  getRouteAnimationData() {
    return this.contexts.getContext('primary')?.route?.snapshot?.data?.[
      'animation'
    ];
  }
}
