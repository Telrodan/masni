import { Component } from '@angular/core';

import { carouselImages, menuItems } from './NYUSZKO-SHOP_DATA';

@Component({
  selector: 'masni-handmade-dolls-nyuszko-kucko',
  templateUrl: './nyuszko-shop.component.html',
  styleUrls: ['./nyuszko-shop.component.scss']
})
export class NyuszkoShopComponent {
  public carouselImages = [
    '../../../../assets/images/landing-page/first-carousel/test-product-image-1.jpg',
    '../../../../assets/images/landing-page/first-carousel/test-product-image-2.jpg',
    '../../../../assets/images/landing-page/first-carousel/test-product-image-3.jpg',
    '../../../../assets/images/landing-page/first-carousel/test-product-image-4.jpg',
    '../../../../assets/images/landing-page/first-carousel/test-product-image-5.jpg',
    '../../../../assets/images/landing-page/first-carousel/test-product-image-6.jpg',
    '../../../../assets/images/landing-page/first-carousel/test-product-image-2.jpg',
    '../../../../assets/images/landing-page/first-carousel/test-product-image-3.jpg',
    '../../../../assets/images/landing-page/first-carousel/test-product-image-4.jpg',
    '../../../../assets/images/landing-page/first-carousel/test-product-image-5.jpg',
    '../../../../assets/images/landing-page/first-carousel/test-product-image-6.jpg'
  ];
  public menuItems = menuItems;
}
