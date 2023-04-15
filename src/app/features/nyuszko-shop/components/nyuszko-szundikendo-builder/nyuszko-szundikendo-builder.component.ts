import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { Store } from '@ngrx/store';
import {
  combineLatest,
  debounceTime,
  filter,
  map,
  Observable,
  startWith,
  tap
} from 'rxjs';

import { AuthService } from '@core/services/auth.service';
import { ProductService } from '@core/services/product.service';
import { ShoppingCartService } from '@core/services/shopping-cart.service';
import { sortedMaterialsSelector } from '@core/store/selectors/material.selectors';
import { NyuszkoSzundikendoProduct } from '@core/models/custom-products/nyuszko-szundikendo-product.model';
import { Product } from '@core/models/product.model';
import { categoriesSelector } from '@core/store';
import { Category } from '@core/models/category.model';
import { ProductExtra } from '@core/models/product-extra.model';
import { ToastrService } from '@core/services/toastr.service';
import { capitalizeFirstLetter } from 'src/app/shared/util/first-letter-capital';

interface ProductData {
  baseProduct: Product;
  customProduct: NyuszkoSzundikendoProduct;
  price: number;
}

@Component({
  selector: 'masni-handmade-dolls-nyuszko-szundikendo-builder',
  templateUrl: './nyuszko-szundikendo-builder.component.html',
  styleUrls: ['./nyuszko-szundikendo-builder.component.scss']
})
export class NyuszkoSzundikendoBuilderComponent implements OnInit {
  isAuthenticated$: Observable<boolean>;
  product$: Observable<Product>;
  productData$: Observable<ProductData>;
  productOptions: NyuszkoSzundikendoProduct;
  builderForm: FormGroup;

  constructor(
    private store$: Store,
    private authService: AuthService,
    private productService: ProductService,
    private shoppingCartService: ShoppingCartService,
    private toastr: ToastrService
  ) {}

  public ngOnInit(): void {
    this.isAuthenticated$ = this.authService.getAuthStatus$();
    this.initForm();
    this.productData$ = combineLatest([
      this.store$.select(categoriesSelector).pipe(
        filter((categories) => !!categories.length),
        map((categories) => {
          return this.findProduct(categories);
        })
      ),
      this.store$.select(sortedMaterialsSelector).pipe(
        filter((sortedMaterials) => !!sortedMaterials),
        map((sortedMaterials) =>
          NyuszkoSzundikendoProduct.setUpMaterials(sortedMaterials)
        )
      ),
      this.builderForm.valueChanges.pipe(
        startWith(0),
        debounceTime(300),
        map((value) => this.productService.getProductExtraPrice(value))
      )
    ]).pipe(
      map(([baseProduct, customProduct, price]) => ({
        baseProduct,
        customProduct,
        price: baseProduct.price + price
      }))
    );
  }

  onSubmit(product: Product, price: number): void {
    if (this.builderForm.valid) {
      let nameEmbroidery = '';
      if (this.builderForm.value.nameEmbroideryCheckbox) {
        nameEmbroidery = this.builderForm.value.nameEmbroideryInput.trim();
      }
      const productExtra: ProductExtra = {
        ...this.builderForm.value,
        nameEmbroidery
      };
      const priceUpdatedProduct = {
        ...product,
        price
      };

      this.shoppingCartService
        .addItemToCart(priceUpdatedProduct, productExtra)
        .pipe(
          tap(() => {
            this.toastr.success(
              'Siker',
              `${capitalizeFirstLetter(product.name)} hozzáadva a kosárhoz`
            );
            this.builderForm.reset();
          })
        )
        .subscribe();
    }
  }

  private findProduct(categories: Category[]) {
    const category = categories.find(
      (category) => category.categoryName === 'egyedi termékek'
    );
    const product = category.products.find(
      (product) => product.name === 'nyuszkó-szundikendő'
    );
    return product;
  }

  private initForm(): void {
    this.builderForm = new FormGroup({
      baseColor: new FormControl(null, Validators.required),
      szundikendoColor: new FormControl(null, Validators.required),
      minkyColorBack: new FormControl(null, Validators.required),
      nameEmbroideryCheckbox: new FormControl(false, Validators.required),
      nameEmbroideryInput: new FormControl(''),
      comment: new FormControl(null)
    });
  }
}
