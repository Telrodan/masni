import { Component, OnInit, ViewEncapsulation } from '@angular/core';
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
import { Product } from '@core/models/product.model';
import { selectAllCategories, selectCustomProductByName } from '@core/store';
import { Category } from '@core/models/category.model';
import { ProductExtra } from '@core/models/product-extra.model';
import { ToastrService } from '@core/services/toastr.service';
import { capitalize } from 'src/app/shared/util/first-letter-capital';
import { MackoProduct } from '@core/models/custom-products/macko-product';

interface ProductData {
  baseProduct: Product;
  customProduct: MackoProduct;
  price: number;
}

@Component({
  selector: 'mhd-macko-builder',
  templateUrl: './macko-builder.component.html',
  styleUrls: ['./macko-builder.component.scss']
})
export class MackoBuilderComponent implements OnInit {
  isAuthenticated$: Observable<boolean>;
  product$: Observable<Product>;
  productData$: Observable<ProductData>;
  productOptions: MackoProduct;
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
    //   this.productData$ = combineLatest([
    //     this.store$
    //       .select(selectCustomProductByName('mackó'))
    //       .pipe(filter((product) => !!product)),
    //     this.store$.select(sortedMaterialsSelector).pipe(
    //       filter((sortedMaterials) => !!sortedMaterials),
    //       map((sortedMaterials) => MackoProduct.setUpMaterials(sortedMaterials))
    //     ),
    //     this.builderForm.valueChanges.pipe(
    //       startWith(0),
    //       debounceTime(300),
    //       map((value) => this.productService.getProductExtraPrice(value))
    //     )
    //   ]).pipe(
    //     map(([baseProduct, customProduct, price]) => ({
    //       baseProduct,
    //       customProduct,
    //       price: baseProduct.price + price
    //     }))
    //   );
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
              `${capitalize(product.name)} hozzáadva a kosárhoz`
            );
            this.builderForm.reset();
          })
        )
        .subscribe();
    }
  }

  private initForm(): void {
    this.builderForm = new FormGroup({
      baseColor: new FormControl(null, Validators.required),
      earsAndBodyColor: new FormControl(null, Validators.required),
      noseColor: new FormControl(null, Validators.required),
      nameEmbroideryCheckbox: new FormControl(false, Validators.required),
      nameEmbroideryInput: new FormControl(''),
      comment: new FormControl(null)
    });
  }
}
