import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { Store } from '@ngrx/store';
import {
  combineLatest,
  debounceTime,
  filter,
  map,
  Observable,
  startWith,
  switchMap,
  tap
} from 'rxjs';

import { AuthService } from '@core/services/auth.service';
import { ProductService } from '@core/services/product.service';
import { ShoppingCartService } from '@core/services/shopping-cart.service';
import { productByIdSelector, userSelector } from '@core/store';
import { Product } from '@core/models/product.model';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ProductExtra } from '@core/models/product-extra.model';

interface ProductData {
  product: Product;
  price: number;
}

@UntilDestroy()
@Component({
  selector: 'masni-handmade-dolls-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {
  userCartId: string;
  isAuthenticated$: Observable<boolean>;
  productData$: Observable<ProductData>;
  builderForm: FormGroup;

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private store: Store,
    private shoppingCartService: ShoppingCartService,
    private productService: ProductService
  ) {}

  public ngOnInit(): void {
    this.isAuthenticated$ = this.authService.getAuthStatus$();

    this.initForm();

    this.productData$ = this.route.params.pipe(
      map((params) => params['id']),
      switchMap((productId) =>
        combineLatest([
          this.store
            .select(productByIdSelector(productId))
            .pipe(filter((product) => !!product)),
          this.builderForm.valueChanges.pipe(
            startWith(0),
            debounceTime(300),
            map((value) => (value.nameEmbroideryCheckbox ? 500 : 0))
          )
        ])
      ),
      map(([product, price]) => ({
        product,
        price: product.price + price
      }))
    );

    this.store
      .select(userSelector)
      .pipe(
        filter((user) => !!user),
        map((user) => user.shoppingCart._id),
        tap((id) => {
          this.userCartId = id;
        }),
        untilDestroyed(this)
      )
      .subscribe();
  }

  public onAddToCart(product: Product): void {
    let nameEmbroidery = '';

    if (this.builderForm.value.nameEmbroideryCheckbox) {
      nameEmbroidery = this.builderForm.value.nameEmbroideryInput.trim();
    }

    const productExtra: ProductExtra = {
      comment: this.builderForm.value.comment,
      nameEmbroidery
    };

    this.shoppingCartService
      .addItemToCart(product, productExtra)
      .subscribe((res) => {
        console.log(res);
      });

    // const item: Product = {
    //   // ...product,
    //   // price: this.price,
    //   // details: {
    //   //   nameEmbroideryCheckbox: this.builderForm.get('nameEmbroideryCheckbox')
    //   //     .value,
    //   //   nameEmbroideryInput: name,
    //   //   comment: this.builderForm.get('comment').value
    //   // }
    // };

    // this.shoppingCartService.addReadyProductToShoppingCart(item);
  }

  private initForm(): void {
    this.builderForm = new FormGroup({
      nameEmbroideryCheckbox: new FormControl(false),
      nameEmbroideryInput: new FormControl(''),
      comment: new FormControl('')
    });
  }
}
