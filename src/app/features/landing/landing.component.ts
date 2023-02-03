import { Component, ElementRef, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from 'src/app/core/models/product.model';

import {
  carouselImages,
  carouselData,
  featuredProducts,
  recentNews
} from './LANDING_DATA';

@Component({
  selector: 'masni-handmade-dolls-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {
  public carouselImages = carouselImages;
  public featuredProducts: Product[] = featuredProducts;
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
