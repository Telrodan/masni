import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostBinding,
  Input,
  OnInit,
  Output,
  ViewEncapsulation
} from '@angular/core';
import { Router, RouterModule } from '@angular/router';

import { Observable, tap } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { SkeletonModule } from 'primeng/skeleton';

import { Product } from '@core/models/product.model';
import { AuthService } from '@core/services/auth.service';
import { CookieService } from '@core/services/cookie.service';
import { ProductService } from '@core/services/product.service';

@Component({
  selector: 'nyk-product-card',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonModule, SkeletonModule],
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductCardComponent implements OnInit {
  @HostBinding('class.nyk-product-card') hostClass = true;

  @Input() product: Product;
  @Input() page: number;

  @Output() likeProduct = new EventEmitter<Product>();

  isImageLoading = true;

  isAuthenticated$: Observable<boolean>;

  get isLiked(): boolean {
    return this.product.likes.includes(this.cookieService.getCookie('userId'));
  }

  get isDiscounted(): boolean {
    return this.product.discountedPrice > 0;
  }

  get isNewArrival(): boolean {
    return this.isOneWeekPassed(this.product.createdAt);
  }

  constructor(
    private productSerivce: ProductService,
    private authService: AuthService,
    private cookieService: CookieService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.isAuthenticated$ = this.authService.getAuthStatus$();
  }

  onLike(event: MouseEvent) {
    event.stopPropagation();

    this.productSerivce
      .likeProduct$(this.product.id)
      .pipe(
        tap(() => {
          this.likeProduct.emit();
        })
      )
      .subscribe();
  }

  imageLoaded() {
    this.isImageLoading = false;
  }

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
