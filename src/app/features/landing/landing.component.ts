import { Component, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable, map } from 'rxjs';

import { materialsSelector } from '@core/store/selectors/material.selectors';

import { InspirationService } from '@core/services/inspiration.service';
import { CarouselData } from 'src/app/shared/UI/carousel-with-heading-and-button/carousel-with-heading-and-button.component';
import { selectAllInspiration } from '@core/store/selectors/inspiration.selectors';

const inspirationsCarouselData = {
  heading: 'Inspirációk',
  displayHeading: true,
  images: [],
  isRoundImage: false,
  linkText: 'Mindet megnézem',
  linkRoute: '/inspiration',
  displayLink: true
};

const materialsCarouselData = {
  heading: 'Minták',
  displayHeading: true,
  images: [],
  isRoundImage: false,
  linkText: 'Mindet Megnézem',
  linkRoute: '/samples',
  displayLink: true
};

const theyAlreadyGotOneCarouselData = {
  heading: 'Nekik már van',
  displayHeading: true,
  images: [
    '../../../../assets/images/landing-page/fourth-carousel/image-1.jpg',
    '../../../../assets/images/landing-page/fourth-carousel/image-2.jpg',
    '../../../../assets/images/landing-page/fourth-carousel/image-3.jpg',
    '../../../../assets/images/landing-page/fourth-carousel/image-4.jpg',
    '../../../../assets/images/landing-page/fourth-carousel/image-5.jpg',
    '../../../../assets/images/landing-page/fourth-carousel/image-6.jpg'
  ],
  isRoundImage: true,
  linkText: '',
  linkRoute: '',
  displayLink: false
};

@Component({
  selector: 'mhd-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {
  inspirationsCarouselData$: Observable<CarouselData>;
  materialsCarouselData$: Observable<CarouselData>;
  theyAlreadyGotOneCarouselData = theyAlreadyGotOneCarouselData;

  constructor(private store$: Store) {}

  ngOnInit(): void {
    this.inspirationsCarouselData$ = this.store$
      .select(selectAllInspiration)
      .pipe(
        map((inspirations) => ({
          ...inspirationsCarouselData,
          images: inspirations.map((inspiration) => inspiration.image)
        }))
      );

    this.materialsCarouselData$ = this.store$.select(materialsSelector).pipe(
      map((materials) => ({
        ...materialsCarouselData,
        images: materials.map((material) => material.image)
      }))
    );
  }
}
