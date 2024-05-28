import {
    ChangeDetectionStrategy,
    Component,
    HostBinding,
    OnInit,
    ViewEncapsulation
} from '@angular/core';

import { filter, of, switchMap, tap } from 'rxjs';
import { Carousel } from 'primeng/carousel';

import { AuthService } from './core/services/auth.service';
import { TrackService } from '@core/services/track.service';

import { routeTransitionAnimation } from './route-transition.animations';
import { ChildrenOutletContexts, NavigationEnd, Router, RouterOutlet } from '@angular/router';

import AOS from 'aos';
import { Store } from '@ngrx/store';
import { CategoryAction } from '@core/store/category';

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
        private trackService: TrackService,
        private store: Store
    ) {
        /**
         * Allows user to scroll on carousel (mobile scroll issue fix)
         */
        Carousel.prototype.onTouchMove = () => {};
    }

    ngOnInit(): void {
        this.store.dispatch(CategoryAction.getCategories());
        this.store.dispatch(CategoryAction.getNavbarMenu());

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

        AOS.init({
            mobile: true
        });
    }

    getRouteAnimationData() {
        return this.contexts.getContext('primary')?.route?.snapshot?.data?.['animation'];
    }
}
