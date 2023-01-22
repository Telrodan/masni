import { Component, ElementRef, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { carouselImages, featuredProducts, recentNews } from './LANDING_DATA';

@Component({
  selector: 'masni-handmade-dolls-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {
  public carouselImages = carouselImages;
  public featuredProducts = featuredProducts;
  public recentNews = recentNews;

  constructor(private route: ActivatedRoute, private el: ElementRef) {}

  public ngOnInit(): void {
    this.route.fragment.subscribe((fragment) => {
      if (fragment) {
        const element = this.el.nativeElement.querySelector('#' + fragment);
        element.scrollIntoView();
      }
    });
  }
}
