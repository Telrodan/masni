import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from '@core/models/product.model';
import { AuthService } from '@core/services/auth.service';
import { productByIdSelector } from '@core/store';

import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { Store } from '@ngrx/store';
import { map, Observable, switchMap } from 'rxjs';

@Component({
  selector: 'masni-handmade-dolls-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {
  public isAuthenticated$: Observable<boolean>;
  public product$: Observable<Product>;

  public images = [
    '../../../../assets/images/nyuszko-shop/nyuszko-builder/image-1.jpg',
    '../../../../assets/images/nyuszko-shop/nyuszko-builder/image-2.jpg',
    '../../../../assets/images/nyuszko-shop/nyuszko-builder/image-3.jpg',
    '../../../../assets/images/nyuszko-shop/nyuszko-builder/image-4.jpg'
  ];

  public faShoppingCart = faShoppingCart;

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private store$: Store
  ) {}

  public ngOnInit(): void {
    this.isAuthenticated$ = this.authService.getAuthStatus$();
    this.product$ = this.route.params.pipe(
      map((params) => params['id']),
      switchMap((productId) =>
        this.store$.select(productByIdSelector(productId))
      )
    );
    // this.getProductDetails();
    // this.carouselImages = this.productDetails.imgSrc;
  }

  // public getProductDetails(): void {
  //   const currentUrl = this.location.path();
  //   const urlSegments = currentUrl.split('/');
  //   const lastSegment = urlSegments[urlSegments.length - 1];
  //   const details = this.detailsArr.find(
  //     (item: ProductDetails) => item.slug === lastSegment
  //   );
  //   if (details) {
  //     this.productDetails = details;
  //   }
  // }
}
