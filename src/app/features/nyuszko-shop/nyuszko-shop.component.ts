import { Component } from '@angular/core';

import { carouselImages, menuItems } from './NYUSZKO-SHOP_DATA';

@Component({
  selector: 'mhd-nyuszko-kucko',
  templateUrl: './nyuszko-shop.component.html',
  styleUrls: ['./nyuszko-shop.component.scss']
})
export class NyuszkoShopComponent {
  public carouselImages = carouselImages;
  public menuItems = menuItems;
}
