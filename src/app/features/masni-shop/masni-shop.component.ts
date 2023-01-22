import { Component } from '@angular/core';

import { carouselImages, menuItems } from './MASNI-SHOP_DATA';

@Component({
  selector: 'masni-handmade-dolls-masni-shop',
  templateUrl: './masni-shop.component.html',
  styleUrls: ['./masni-shop.component.scss']
})
export class MasniShopComponent {
  public carouselImages = carouselImages;
  public menuItems = menuItems;
}
