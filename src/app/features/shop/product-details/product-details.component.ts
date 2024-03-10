import {
    ChangeDetectionStrategy,
    Component,
    HostBinding,
    OnInit,
    ViewEncapsulation
} from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import {
    BehaviorSubject,
    map,
    Observable,
    startWith,
    switchMap,
    tap
} from 'rxjs';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '@core/services/auth.service';
import { ShoppingCartService } from '@core/services/shopping-cart.service';

import { Product } from '@core/models/product.model';
import { ToastrService } from '@core/services/toastr.service';
import { PreviousRouteService } from '@core/services/previous-route.service';
import { CommonModule, Location } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { GalleriaModule } from 'primeng/galleria';
import { SkeletonModule } from 'primeng/skeleton';
import { ProductService } from '@core/services/product.service';
import { InputNumberModule } from 'primeng/inputnumber';
import { CookieService } from '@core/services/cookie.service';
import { TabViewModule } from 'primeng/tabview';
import { ButtonModule } from 'primeng/button';
import { BreadcrumpComponent } from '@shared/breadcrump/breadcrump.component';
import { ProductDetailsGalleryComponent } from './product-details-gallery/product-details-gallery.component';
import { ProductDetailsFormComponent } from './product-details-form/product-details-form.component';
import { CategoryService } from '@core/services/category.service';
import { ProductCardComponent } from '@shared/product-card/product-card.component';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { ProductDetailsReviewsComponent } from './product-details-reviews/product-details-reviews.component';
import { BackendReview } from '@core/models/review.model';
import { ReviewService } from '@core/services/review.service';

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
    price = 0;

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
        private categoryService: CategoryService,
        private shoppingCartService: ShoppingCartService,
        private reviewService: ReviewService,
        private previousRouteService: PreviousRouteService,
        private cookieService: CookieService,
        private route: ActivatedRoute,
        private toastr: ToastrService,
        private fb: FormBuilder,
        private router: Router,
        private location: Location,
        private snackBar: MatSnackBar
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

    shareProduct(): void {
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
    }

    onDecreaseQty(): void {
        if (this.orderQty === 1) {
            return;
        }
        this.orderQty--;
    }

    onBack(): void {
        if (this.previousRouteService.getPreviousUrl() === this.router.url) {
            this.router.navigate(['/shop/all']);
        } else {
            this.router.navigate([this.previousRouteService.getPreviousUrl()]);
        }
    }

    trackById(index: number, product: Product): string {
        return product.id;
    }

    onrefreshProduct(): void {
        this.refreshProduct$.next();
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
        // if (this.productForm.valid) {
        //     const questions = [];
        //     for (const key of Object.keys(this.productForm.value.questions)) {
        //         const value = this.productForm.value.questions[key];
        //         const question = this.product.questions.find(
        //             (question) => question.id === key
        //         );
        //         const option = question.options.find(
        //             (option) => option._id === value
        //         );
        //         if (value) {
        //             questions.push({
        //                 question: question.question,
        //                 optionId: value,
        //                 option: option.slug
        //             });
        //         }
        //     }
        //     const cartItem: ShoppingCartItem = {
        //         product: this.product,
        //         price: this.price,
        //         questions,
        //         nameEmbroidery: this.productForm.value.nameEmbroidery.trim(),
        //         comment: this.productForm.value.comment
        //     };
        //     this.shoppingCartService
        //         .addItemToCart(cartItem)
        //         .pipe(
        //             tap(() => {
        //                 this.toastr.success(
        //                     `${cartItem.product.name} hozzáadva a kosárhoz`
        //                 );
        //                 this.productForm.reset();
        //                 this.productForm.get('nameEmbroidery').patchValue('');
        //                 if (cartItem.product.isDressable) {
        //                     this.dialog.open(DollDressDialogComponent);
        //                 }
        //             })
        //         )
        //         .subscribe();
        // } else {
        //     this.toastr.info('Kérlek töltsd ki az összes mezőt!');
        // }
    }
}
