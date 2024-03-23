import {
    ChangeDetectionStrategy,
    Component,
    HostBinding,
    OnInit,
    ViewChild,
    ViewEncapsulation
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule, Location } from '@angular/common';

import {
    BehaviorSubject,
    map,
    Observable,
    startWith,
    switchMap,
    tap
} from 'rxjs';
import { DropdownModule } from 'primeng/dropdown';
import { GalleriaModule } from 'primeng/galleria';
import { SkeletonModule } from 'primeng/skeleton';
import { InputNumberModule } from 'primeng/inputnumber';
import { TabViewModule } from 'primeng/tabview';
import { ButtonModule } from 'primeng/button';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';

import { Product } from '@core/models/product.model';
import { AuthService } from '@core/services/auth.service';
import { ToastrService } from '@core/services/toastr.service';
import { PreviousRouteService } from '@core/services/previous-route.service';
import { ShoppingCartService } from '@core/services/shopping-cart.service';
import { BackendReview } from '@core/models/review.model';
import { ReviewService } from '@core/services/review.service';
import {
    BackendShoppingCartItem,
    ShoppingCartItem
} from '@core/models/shopping-cart-item.model';
import { ProductService } from '@core/services/product.service';
import { CookieService } from '@core/services/cookie.service';
import { BreadcrumpComponent } from '@shared/breadcrump/breadcrump.component';
import { ProductCardComponent } from '@shared/product-card/product-card.component';
import { ProductDetailsGalleryComponent } from './product-details-gallery/product-details-gallery.component';
import { ProductDetailsFormComponent } from './product-details-form/product-details-form.component';
import { ProductDetailsReviewsComponent } from './product-details-reviews/product-details-reviews.component';
import { DollDressDialogComponent } from '../doll-dress-dialog/doll-dress-dialog.component';

@Component({
    selector: 'nyk-product-details',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        FormsModule,
        ReactiveFormsModule,
        DropdownModule,
        InputTextareaModule,
        GalleriaModule,
        SkeletonModule,
        InputNumberModule,
        TabViewModule,
        ButtonModule,
        BreadcrumpComponent,
        ClipboardModule,
        MatSnackBarModule,
        ProductDetailsGalleryComponent,
        ProductDetailsFormComponent,
        ProductCardComponent,
        ProductDetailsReviewsComponent,
        CarouselModule,
        SkeletonModule
    ],
    templateUrl: './product-details.component.html',
    styleUrls: ['./product-details.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductDetailsComponent implements OnInit {
    @HostBinding('class.nyk-product-details') hostClass = true;

    @ViewChild('productDetailsForm', { static: false })
    productDetailsFormComponent: ProductDetailsFormComponent;

    get isLiked(): boolean {
        return this.product.likes.includes(
            this.cookieService.getCookie('userId')
        );
    }

    refreshProduct$ = new BehaviorSubject<void>(null);

    product$: Observable<Product>;
    relatedProduct$: Observable<Product[]>;
    isAuthenticated$: Observable<boolean>;
    product: Product;
    fullUrl = '';
    orderQty = 1;
    originalPrice = 0;
    totalPrice = 0;

    customOptions: OwlOptions = {
        loop: true,
        autoplay: true,
        autoplayTimeout: 10000,
        autoplayHoverPause: true,
        autoplaySpeed: 1000,
        touchDrag: true,
        pullDrag: true,
        dots: false,
        navSpeed: 1000,
        navText: [
            '<i class="pi pi-chevron-left"></i>',
            '<i class="pi pi-chevron-right"></i>'
        ],
        responsive: {
            0: {
                items: 1
            },
            400: {
                items: 2
            },
            740: {
                items: 5
            }
        },
        nav: true
    };

    constructor(
        private authService: AuthService,
        private productService: ProductService,
        private reviewService: ReviewService,
        private previousRouteService: PreviousRouteService,
        private shoppingCartService: ShoppingCartService,
        private cookieService: CookieService,
        private route: ActivatedRoute,
        private toastr: ToastrService,
        private router: Router,
        private location: Location,
        private snackBar: MatSnackBar,
        private dialog: MatDialog
    ) {}

    ngOnInit(): void {
        this.isAuthenticated$ = this.authService.getAuthStatus$();

        this.product$ = this.refreshProduct$.pipe(
            startWith(null),
            switchMap(() =>
                this.route.params.pipe(
                    map((params) => params['id']),
                    switchMap((id) => this.productService.getProductById$(id)),
                    tap((product) => {
                        this.product = product;
                        this.product.category.items =
                            this.product.category.items.filter(
                                (item) => item.id !== this.product.id
                            );
                        this.fullUrl =
                            'https://www.nyuszkokucko.hu/#' +
                            this.location.path();
                    })
                )
            )
        );
    }

    onShareProduct(): void {
        this.snackBar.open('A termék linkje másolva a vágólapra', 'Bezár', {
            duration: 3000
        });
    }

    onLike(): void {
        this.productService
            .likeProduct$(this.product.id)
            .pipe(
                tap(() => {
                    this.refreshProduct$.next();
                })
            )
            .subscribe();
    }

    onIncreaseQty(): void {
        if (this.orderQty === this.product.stock) {
            return;
        }
        this.orderQty++;
        this.totalPrice = this.originalPrice * this.orderQty;
    }

    onDecreaseQty(): void {
        if (this.orderQty === 1) {
            return;
        }
        this.orderQty--;
        this.totalPrice = this.originalPrice * this.orderQty;
    }

    onBack(): void {
        if (this.previousRouteService.getPreviousUrl() === this.router.url) {
            this.router.navigate(['/shop/all']);
        } else {
            this.router.navigate([this.previousRouteService.getPreviousUrl()]);
        }
    }

    onPriceChange(price: number): void {
        if (this.originalPrice !== price) {
            this.originalPrice = price;
        }

        this.totalPrice = price * this.orderQty;
    }

    trackById(index: number, product: Product): string {
        return product.id;
    }

    onReviewProduct(review: BackendReview): void {
        this.reviewService
            .addReview$(review)
            .pipe(
                tap(() => {
                    this.toastr.success('Köszönjük a véleményed!');
                    this.refreshProduct$.next();
                })
            )
            .subscribe();
    }

    onAddToCart(): void {
        if (this.productDetailsFormComponent.productDetailsForm.valid) {
            const questions = [];
            for (const key of Object.keys(
                this.productDetailsFormComponent.productDetailsForm.value
                    .questions
            )) {
                const value =
                    this.productDetailsFormComponent.productDetailsForm.value
                        .questions[key];
                const question = this.product.questions.find(
                    (question) => question.id === key
                );
                const option = question.options.find(
                    (option) => option._id === value
                );
                if (value) {
                    questions.push({
                        question: question.question,
                        optionId: value,
                        option: option.slug
                    });
                }
            }
            const cartItem: BackendShoppingCartItem = {
                product: this.product,
                price: this.totalPrice,
                questions,
                nameEmbroidery:
                    this.productDetailsFormComponent.productDetailsForm.value.nameEmbroidery.trim(),
                comment:
                    this.productDetailsFormComponent.productDetailsForm.value
                        .comment,
                quantity: this.orderQty
            };

            this.shoppingCartService
                .addItemToCart(cartItem)
                .pipe(
                    tap(() => {
                        this.toastr.success(
                            `${cartItem.product.name} hozzáadva a kosárhoz`
                        );
                        this.productDetailsFormComponent.productDetailsForm.reset();
                        this.productDetailsFormComponent.productDetailsForm
                            .get('nameEmbroidery')
                            .patchValue('');
                        this.productDetailsFormComponent.productDetailsForm
                            .get('comment')
                            .patchValue('');

                        this.orderQty = 1;
                        this.totalPrice = this.originalPrice;

                        if (cartItem.product.isDressable) {
                            this.dialog.open(DollDressDialogComponent, {
                                minWidth: '40vw'
                            });
                        }
                    })
                )
                .subscribe();
        } else {
            this.toastr.info('Kérlek töltsd ki az összes mezőt!');
        }
    }
}
