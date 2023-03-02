import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Carousel } from 'primeng/carousel';
import { filter, map } from 'rxjs';
import coreActions from './core/core-ngrx/actions';

import { AuthService } from './core/services/auth.service';
import { MaterialService } from './core/services/material.service';

@Component({
  selector: 'masni-handmade-dolls-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private store$: Store,
    private materialService: MaterialService
  ) {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    Carousel.prototype.onTouchMove = () => {};
  }

  public ngOnInit(): void {
    this.authService.autoAuthentication();
    this.materialService
      .getMaterialsStore$()
      .pipe(
        filter((materials) => !!materials),
        map((materials) => {
          this.store$.dispatch(coreActions.setMaterials({ materials }));
        })
      )
      .subscribe();
  }
}
