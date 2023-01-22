import { Component, Input } from '@angular/core';

import { faCartShopping } from '@fortawesome/free-solid-svg-icons';
import { Product } from 'src/app/core/models/product.model';

@Component({
  selector: 'masni-handmade-dolls-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss']
})
export class ProductCardComponent {
  @Input() product: Product | undefined;
  public faCartShopping = faCartShopping;
}
