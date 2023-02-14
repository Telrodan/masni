import { Component } from '@angular/core';

import { carouselImages, menuItems } from './NYUSZKO-SHOP_DATA';

@Component({
  selector: 'masni-handmade-dolls-nyuszko-kucko',
  templateUrl: './nyuszko-shop.component.html',
  styleUrls: ['./nyuszko-shop.component.scss']
})
export class NyuszkoShopComponent {
  public carouselImages = carouselImages;
  public menuItems = menuItems;
}
