import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from '@core/models/product.model';

import { faCartShopping } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'masni-handmade-dolls-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss']
})
export class ProductCardComponent {
  @Input() product: Product;
  public faCartShopping = faCartShopping;

  constructor(private router: Router) {}

  public productDetails() {
    this.router.navigate(['/shop', this.product._id]);
  }
}
