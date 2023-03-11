import { Component, Input } from '@angular/core';

import { faCartShopping } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'masni-handmade-dolls-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss']
})
export class ProductCardComponent {
  @Input() product: any;

  public faCartShopping = faCartShopping;
}
