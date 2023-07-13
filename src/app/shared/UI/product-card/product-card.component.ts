import { Component, Input } from '@angular/core';

import { faCartShopping } from '@fortawesome/free-solid-svg-icons';

import { Product } from '@core/models/product.model';
import { Router } from '@angular/router';

@Component({
  selector: 'mhd-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss']
})
export class ProductCardComponent {
  @Input() product: Product;

  constructor(private router: Router) {}

  isImageLoading = true;

  faCartShopping = faCartShopping;

  onProductDetails(): void {
    this.router.navigate(['/shop', this.product.id]);
  }

  changeSkeletonLoad(): void {
    this.isImageLoading = false;
  }
}
