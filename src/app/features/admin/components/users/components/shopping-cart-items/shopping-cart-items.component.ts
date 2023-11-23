import { Component, HostBinding, Input } from '@angular/core';
import { ShoppingCartItem } from '@core/models/shopping-cart-item.model';

@Component({
  selector: 'mhd-shopping-cart-items',
  templateUrl: './shopping-cart-items.component.html',
  styleUrls: ['./shopping-cart-items.component.scss']
})
export class ShoppingCartItemsComponent {
  @HostBinding('class') class = 'mhd-shopping-cart-items';
  @Input() cartItems: ShoppingCartItem[];

  imageLoadedStatus: boolean[] = [];

  imageLoaded(index: number) {
    this.imageLoadedStatus[index] = true;
  }
}
