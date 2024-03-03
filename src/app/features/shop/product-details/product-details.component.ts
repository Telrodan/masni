import { Component, HostBinding, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { Store } from '@ngrx/store';
import { filter, map, Observable, startWith, switchMap, tap } from 'rxjs';

import { AuthService } from '@core/services/auth.service';
import { ShoppingCartService } from '@core/services/shopping-cart.service';
import {
  selectCategoryById,
  selectProductById,
  selectQuestionOptionExtraPriceByOptionId
} from '@core/store';
import { Product } from '@core/models/product.model';
import { ToastrService } from '@core/services/toastr.service';
import { PreviousRouteService } from '@core/services/previous-route.service';
import { ShoppingCartItem } from '@core/models/shopping-cart-item.model';
import { MatDialog } from '@angular/material/dialog';
import { DollDressDialogComponent } from '../doll-dress-dialog/doll-dress-dialog.component';
import { Inspiration } from '@core/models/inspiration.model';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { GalleriaModule } from 'primeng/galleria';
import { SkeletonModule } from 'primeng/skeleton';
import { ProductService } from '@core/services/product.service';
import { InputNumberModule } from 'primeng/inputnumber';
import { CookieService } from '@core/services/cookie.service';
import { TabViewModule } from 'primeng/tabview';
import { ButtonModule } from 'primeng/button';

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
    ButtonModule
  ],
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {
  @HostBinding('class.nyk-product-details') hostClass = true;

  product$: Observable<Product>;
  isAuthenticated$ = this.authService.getAuthStatus$();

  inspirations: Inspiration[];

  productForm: FormGroup;
  product: Product;
  price = 0;

  activeIndex = 0;
  displayCustomGalery = false;

  imageLoadedStatus: boolean[] = [];

  selectedImageIndex = 0;
  selectedImageIndex2 = 0;
  quantity = 1;

  get isLiked(): boolean {
    return this.product.likes.includes(this.cookieService.getCookie('userId'));
  }

  constructor(
    private productService: ProductService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private shoppingCartService: ShoppingCartService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private previousRouteService: PreviousRouteService,
    private router: Router,
    private dialog: MatDialog,
    private cookieService: CookieService
  ) {}

  ngOnInit(): void {
    this.product$ = this.route.params.pipe(
      map((params) => params['id']),
      switchMap((id) => this.productService.getProductById$(id)),
      tap((product) => {
        this.product = product;
      })
    );

    // this.product$ = this.route.params.pipe(
    //   map((params) => params['id']),
    //   switchMap((id) =>
    //     this.store$.select(selectProductById(id)).pipe(
    //       filter((product) => !!product),
    //       tap((product) => {
    //         console.log('product', product);
    //         this.product = product;
    //         const formControls = {};
    //         product.questions.forEach((question) => {
    //           formControls[question.id] = ['', Validators.required];
    //         });

    //         this.productForm = this.fb.group({
    //           comment: [''],
    //           nameEmbroidery: [''],
    //           questions: this.fb.group({
    //             ...formControls
    //           })
    //         });
    //       })
    //     )
    //   ),
    //   switchMap((product) =>
    //     this.productForm.valueChanges.pipe(
    //       startWith(this.productForm.value),
    //       map((changes) => {
    //         this.price = product.discountedPrice
    //           ? product.discountedPrice
    //           : product.price;

    //         if (changes.nameEmbroidery) {
    //           this.price += 500;
    //         }

    //         for (const key of Object.keys(changes.questions)) {
    //           const value = changes.questions[key];
    //           if (value) {
    //             this.store$
    //               .select(selectQuestionOptionExtraPriceByOptionId(value))
    //               .pipe(
    //                 tap((extraPrice) => {
    //                   this.price += extraPrice;
    //                 })
    //               )
    //               .subscribe();
    //           }
    //         }

    //         return product;
    //       })
    //     )
    //   ),
    //   switchMap((product) =>
    //     this.store$
    //       .select(selectCategoryById(product.inspirationCategory?.id))
    //       .pipe(
    //         map((category) => {
    //           if (category) {
    //             this.inspirations = category.items as Inspiration[];
    //           }
    //           return product;
    //         })
    //       )
    //   )
    // );
  }

  onBack(): void {
    if (this.previousRouteService.getPreviousUrl() === this.router.url) {
      this.router.navigate(['/shop/all']);
    } else {
      this.router.navigate([this.previousRouteService.getPreviousUrl()]);
    }
  }

  onAddToCart(): void {
    if (this.productForm.valid) {
      const questions = [];
      for (const key of Object.keys(this.productForm.value.questions)) {
        const value = this.productForm.value.questions[key];
        const question = this.product.questions.find(
          (question) => question.id === key
        );
        const option = question.options.find((option) => option._id === value);

        if (value) {
          questions.push({
            question: question.question,
            optionId: value,
            option: option.slug
          });
        }
      }

      const cartItem: ShoppingCartItem = {
        product: this.product,
        price: this.price,
        questions,
        nameEmbroidery: this.productForm.value.nameEmbroidery.trim(),
        comment: this.productForm.value.comment
      };

      this.shoppingCartService
        .addItemToCart(cartItem)
        .pipe(
          tap(() => {
            this.toastr.success(
              `${cartItem.product.name} hozzáadva a kosárhoz`
            );
            this.productForm.reset();
            this.productForm.get('nameEmbroidery').patchValue('');

            if (cartItem.product.isDressable) {
              this.dialog.open(DollDressDialogComponent);
            }
          })
        )
        .subscribe();
    } else {
      this.toastr.info('Kérlek töltsd ki az összes mezőt!');
    }
  }

  imageClickGalery(index: number): void {
    this.activeIndex = index;
    this.displayCustomGalery = true;
  }

  imageLoaded(index: number) {
    this.imageLoadedStatus[index] = true;
  }
}
