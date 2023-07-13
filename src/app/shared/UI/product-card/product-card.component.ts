import { Component, Input } from '@angular/core';

import { faCartShopping } from '@fortawesome/free-solid-svg-icons';

import { Product } from '@core/models/product.model';

@Component({
  selector: 'mhd-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss']
})
export class ProductCardComponent {
  @Input() product: Product;

  isImageLoading = true;

  faCartShopping = faCartShopping;

  changeSkeletonLoad(): void {
    this.isImageLoading = false;
  }
}
