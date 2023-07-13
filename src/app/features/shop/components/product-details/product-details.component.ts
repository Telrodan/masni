import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

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
import { ShoppingCartService } from '@core/services/shopping-cart.service';
import { productByIdSelector } from '@core/store';
import { Product } from '@core/models/product.model';
import { ProductExtra } from '@core/models/product-extra.model';
import { ToastrService } from '@core/services/toastr.service';

interface ProductData {
  product: Product;
  price: number;
}

@Component({
  selector: 'mhd-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {
  isAuthenticated$: Observable<boolean>;
  productData$: Observable<ProductData>;
  builderForm: FormGroup;

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private store: Store,
    private shoppingCartService: ShoppingCartService,
    private toastr: ToastrService
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
        price:
          product.discountedPrice > 0
            ? product.discountedPrice + price
            : product.price + price
      }))
    );
  }

  onAddToCart(product: Product): void {
    const modifiedProduct = {
      ...product,
      price:
        product.discountedPrice > 0 ? product.discountedPrice : product.price
    };
    let nameEmbroidery = '';
    if (this.builderForm.value.nameEmbroideryCheckbox) {
      nameEmbroidery = this.builderForm.value.nameEmbroideryInput.trim();
    }

    const productExtra: ProductExtra = {
      ...this.builderForm.value,
      nameEmbroidery
    };

    if (productExtra.nameEmbroidery) {
      modifiedProduct.price += 500;
    }

    this.shoppingCartService
      .addItemToCart(modifiedProduct, productExtra)
      .pipe(
        tap(() => {
          this.toastr.success(`${product.name} hozzáadva a kosárhoz`);
          this.builderForm.reset();
        })
      )
      .subscribe();
  }

  private initForm(): void {
    this.builderForm = new FormGroup({
      nameEmbroideryCheckbox: new FormControl(false),
      nameEmbroideryInput: new FormControl('')
    });
  }
}
