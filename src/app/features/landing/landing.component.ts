import { Component, OnInit } from '@angular/core';

import { UntilDestroy } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';
import { map, tap } from 'rxjs';

import { materialsSelector } from '@core/store/selectors/material.selectors';

import {
  firstCarousel,
  secondCarousel,
  thirdCarousel,
  fourthCarousel
} from './LANDING_DATA';
import { InspirationService } from '@core/services/inspiration.service';

@UntilDestroy({ checkProperties: true })
@Component({
  selector: 'masni-handmade-dolls-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {
  public firstCarousel = firstCarousel;
  public secondCarousel = secondCarousel;
  public thirdCarousel = thirdCarousel;
  public fourthCarousel = fourthCarousel;

  constructor(
    private store$: Store,
    private inspirationService: InspirationService
  ) {}

  public ngOnInit(): void {
    this.store$
      .select(materialsSelector)
      .pipe(
        map((materials) => {
          const materialImages = materials.map((material) => {
            return material.image;
          });
          return materialImages.filter((image) => !!image);
        }),
        tap((materialImages) => {
          this.secondCarousel.images = materialImages;
        })
      )
      .subscribe();

    this.inspirationService
      .fetchInspirations$()
      .pipe(
        tap((inspirations) => {
          this.firstCarousel.images = inspirations.map(
            (inspiration) => inspiration.image
          );
        })
      )
      .subscribe();
  }

  public scrollToTop() {
    document.querySelector('body').scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }
}
