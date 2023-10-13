import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

import { Product } from '@core/models/product.model';

@Component({
  selector: 'mhd-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss']
})
export class ProductCardComponent {
  @Input() product: Product;
  @Input() page: number;

  isImageLoading = true;

  constructor(private router: Router) {}

  onProductDetails(): void {
    if (this.page >= 0) {
      sessionStorage.setItem('page', this.page.toString());
    }
    this.router.navigate(['/shop/product-details', this.product.id]);
  }

  isOneWeekPassed(date: Date): boolean {
    const otherDate = new Date(date);
    const oneWeekInMilliseconds = 7 * 24 * 60 * 60 * 1000;
    const today = new Date();
    const difference = today.getTime() - otherDate.getTime();

    return difference <= Number(oneWeekInMilliseconds);
  }
}
