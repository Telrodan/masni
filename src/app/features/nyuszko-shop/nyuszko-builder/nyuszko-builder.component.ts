import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { Store } from '@ngrx/store';
import { UntilDestroy } from '@ngneat/until-destroy';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
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
import { sortedMaterialsSelector } from '@core/store/selectors/material.selector';
import { NyuszkoProduct } from '@core/models/custom-products/nyuszko-product.model';
import { SortedMaterials } from '@core/models/sorted-materials.model';
import { Product } from '@core/models/product.model';
import { categoriesSelector } from '@core/store';

interface ProductData {
  baseProduct: Product;
  customProduct: NyuszkoProduct;
  price: number;
}

@UntilDestroy()
@Component({
  selector: 'masni-handmade-dolls-nyuszko-builder',
  templateUrl: './nyuszko-builder.component.html',
  styleUrls: ['./nyuszko-builder.component.scss']
})
export class NyuszkoBuilderComponent implements OnInit {
  isAuthenticated$: Observable<boolean>;
  product$: Observable<Product>;
  productData$: Observable<ProductData>;

  public productOptions: NyuszkoProduct;
  public sortedMaterials$: Observable<SortedMaterials>;
  public price = 0;
  public builderForm: FormGroup = new FormGroup({});
  public productImagesUrl = [
    '../../../../assets/images/nyuszko-shop/nyuszko-builder/image-1.jpg',
    '../../../../assets/images/nyuszko-shop/nyuszko-builder/image-2.jpg',
    '../../../../assets/images/nyuszko-shop/nyuszko-builder/image-3.jpg',
    '../../../../assets/images/nyuszko-shop/nyuszko-builder/image-4.jpg'
  ];
  public faShoppingCart = faShoppingCart;

  constructor(
    private store$: Store,
    private authService: AuthService,
    private productService: ProductService,
    private shoppingCartService: ShoppingCartService
  ) {}

  public ngOnInit(): void {
    this.isAuthenticated$ = this.authService.getAuthStatus$();

    this.productData$ = combineLatest([
      this.store$.select(categoriesSelector).pipe(
        filter((categories) => !!categories.length),
        map((categories) => {
          const category = categories.find(
            (category) => category.categoryName === 'egyedi termékek'
          );
          const product = category.products.find(
            (product) => product.name === 'nyuszkó'
          );

          return product;
        })
      ),
      this.store$.select(sortedMaterialsSelector).pipe(
        filter((sortedMaterials) => !!sortedMaterials),
        map((sortedMaterials) => NyuszkoProduct.setUpMaterials(sortedMaterials))
      ),
      this.builderForm.valueChanges.pipe(
        startWith(0),
        debounceTime(300),
        map((value) => {
          let price = 0;
          price = this.productService.getProductPrice(value);

          return price;
        })
      )
    ]).pipe(
      tap(() => {}),
      map(([baseProduct, customProduct, price]) => ({
        baseProduct,
        customProduct,
        price: baseProduct.price + price
      }))
    );

    // this.store$
    //   .select(sortedMaterialsSelector)
    //   .pipe(
    //     filter((sortedMaterials) => !!sortedMaterials),
    //     map((sortedMaterials) =>
    //       NyuszkoProduct.setUpMaterials(sortedMaterials)
    //     ),
    //     tap((product) => {
    //       this.productOptions = product;
    //       this.createForm(product);
    //     }),
    //     switchMap(() => this.builderForm.valueChanges),
    //     tap((changes) => {
    //       this.price = this.productService.getProductPrice(changes);
    //     })
    //   )
    //   .subscribe();
  }

  public onSubmit(): void {
    if (!this.builderForm.valid) return;
    const item = { ...this.builderForm.value, price: this.price };
    // this.shoppingCartService.addBuiltProductToShoppingCart(item);
  }

  private initForm(): void {
    this.builderForm = new FormGroup({
      baseColor: new FormControl(null, Validators.required),
      earsColor: new FormControl(null, Validators.required),
      ribbonColor: new FormControl(null, Validators.required),
      extraMinkyEarsCheckbox: new FormControl(false, Validators.required),
      extraMinkyEarsInput: new FormControl(null),
      nameEmbroideryCheckbox: new FormControl(false, Validators.required),
      nameEmbroideryInput: new FormControl(null),
      productComment: new FormControl(null)
    });

    this.price = this.productService.getProductPrice(this.builderForm.value);
  }
}
