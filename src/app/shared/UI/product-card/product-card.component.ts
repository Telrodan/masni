import { Component, Input, OnInit } from '@angular/core';
import { Product } from '@core/models/product.model';

import { faCartShopping } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'masni-handmade-dolls-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss']
})
export class ProductCardComponent implements OnInit {
  @Input() product: Product;

  public ngOnInit(): void {
    console.log(this.product);
  }

  public faCartShopping = faCartShopping;
}
