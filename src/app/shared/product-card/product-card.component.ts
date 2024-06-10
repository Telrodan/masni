import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    HostBinding,
    Input,
    OnInit,
    Output,
    ViewEncapsulation,
    inject
} from '@angular/core';
import { Router, RouterModule } from '@angular/router';

import { Observable, tap } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { SkeletonModule } from 'primeng/skeleton';

import { AuthService } from '@core/services/auth.service';
import { CookieService } from '@core/services/cookie.service';
import { ProductService } from '@core/services/product.service';
import { Product } from '@core/store/product/product.model';
import { ButtonComponent } from '@shared/button/button.component';

@Component({
    selector: 'nyk-product-card',
    standalone: true,
    imports: [CommonModule, RouterModule, ButtonModule, SkeletonModule, ButtonComponent],
    templateUrl: './product-card.component.html',
    styleUrls: ['./product-card.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductCardComponent implements OnInit {
    @HostBinding('class.nyk-product-card') hostClass = true;

    @Input() product: Product;
    @Input() page: number;

    isAuthenticated$: Observable<boolean>;

    isDiscounted = false;
    isImageLoading = true;
    isNewArrival = false;

    private readonly authService = inject(AuthService);
    private readonly router = inject(Router);

    ngOnInit(): void {
        this.isAuthenticated$ = this.authService.getAuthStatus$();
        this.isDiscounted = this.product.discountedPrice > 0;
        this.isNewArrival = this.isOneWeekPassed(this.product.createdAt);
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

    private isOneWeekPassed(date: Date): boolean {
        const otherDate = new Date(date);
        const oneWeekInMilliseconds = 7 * 24 * 60 * 60 * 1000;
        const today = new Date();
        const difference = today.getTime() - otherDate.getTime();

        return difference <= Number(oneWeekInMilliseconds);
    }
}
