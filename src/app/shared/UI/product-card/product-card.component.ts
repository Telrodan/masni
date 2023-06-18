import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

import { faCartShopping } from '@fortawesome/free-solid-svg-icons';

import { Product } from '@core/models/product.model';

@Component({
  selector: 'masni-handmade-dolls-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss']
})
export class ProductCardComponent {
  @Input() product: Product;

  isImageLoading = true;

  faCartShopping = faCartShopping;

  constructor(private router: Router) {}

  productDetails(): void {
    this.router.navigate(['/shop', this.product._id]);
  }

  changeSkeletonLoad(): void {
    this.isImageLoading = false;
    console.log('image loaded');
  }
}
