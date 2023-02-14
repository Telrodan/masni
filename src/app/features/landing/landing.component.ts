import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil, tap } from 'rxjs';
import { MaterialService } from 'src/app/core/services/material.service';

import {
  firstCarousel,
  secondCarousel,
  thirdCarousel,
  fourthCarousel
} from './LANDING_DATA';

@Component({
  selector: 'masni-handmade-dolls-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit, OnDestroy {
  public firstCarousel = { ...firstCarousel };
  public secondCarousel = { ...secondCarousel };
  public thirdCarousel = { ...thirdCarousel };
  public fourthCarousel = { ...fourthCarousel };
  private destroy = new Subject<null>();

  constructor(private materialService: MaterialService) {}

  public ngOnInit(): void {
    this.materialService
      .getMaterials$()
      .pipe(
        takeUntil(this.destroy),
        tap((materials) => {
          materials.forEach((material) => {
            if (material?.image) {
              this.secondCarousel.images.push(
                '../../../assets/images/materials/' + material.image
              );
            }
          });
        })
      )
      .subscribe();
  }

  public ngOnDestroy(): void {
    this.destroy.next(null);
    this.destroy.complete();
  }

  public scrollToTop() {
    document.querySelector('body').scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }
}
