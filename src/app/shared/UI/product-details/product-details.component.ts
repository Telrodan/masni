import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { ProductDetails } from 'src/app/core/models/product.model';

import { productDetails } from 'src/app/features/nyuszko-shop/NYUSZKO-SHOP_DATA';

@Component({
  selector: 'masni-handmade-dolls-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {
  public carouselImages: string[] = [];
  public productDetails!: ProductDetails;
  public detailsArr: ProductDetails[] = productDetails;

  constructor(private location: Location) {}

  public ngOnInit(): void {
    this.getProductDetails();
    this.carouselImages = this.productDetails.imgSrc;
  }

  public getProductDetails(): void {
    const currentUrl = this.location.path();
    const urlSegments = currentUrl.split('/');
    const lastSegment = urlSegments[urlSegments.length - 1];
    const details = this.detailsArr.find(
      (item: ProductDetails) => item.slug === lastSegment
    );
    if (details) {
      this.productDetails = details;
    }
  }
}
