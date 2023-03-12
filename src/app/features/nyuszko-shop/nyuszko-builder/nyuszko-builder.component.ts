import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { Store } from '@ngrx/store';
import { UntilDestroy } from '@ngneat/until-destroy';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { filter, map, Observable, switchMap, tap } from 'rxjs';

import { AuthService } from '@core/services/auth.service';
import { ProductService } from '@core/services/product.service';
import { ShoppingCartService } from '@core/services/shopping-cart.service';
import { sortedMaterialsSelector } from '@core/store/selectors/material.selector';
import { NyuszkoProduct } from '@core/models/custom-products/nyuszko-product.model';
import { SortedMaterials } from '@core/models/sorted-materials.model';

@UntilDestroy({ checkProperties: true })
@Component({
  selector: 'masni-handmade-dolls-nyuszko-builder',
  templateUrl: './nyuszko-builder.component.html',
  styleUrls: ['./nyuszko-builder.component.scss']
})
export class NyuszkoBuilderComponent implements OnInit {
  public isAuthenticated$: Observable<boolean>;
  public product: NyuszkoProduct;
  public sortedMaterials$: Observable<SortedMaterials>;
  public price = 0;
  public builderForm: FormGroup = new FormGroup({});
  public productImages = [
    '../../../../assets/images/nyuszko-shop/nyuszko-builder/image-1.jpg',
    '../../../../assets/images/nyuszko-shop/nyuszko-builder/image-2.jpg',
    '../../../../assets/images/nyuszko-shop/nyuszko-builder/image-3.jpg',
    '../../../../assets/images/nyuszko-shop/nyuszko-builder/image-4.jpg',
    '../../../../assets/images/nyuszko-shop/nyuszko-builder/image-5.jpg'
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

    this.store$
      .select(sortedMaterialsSelector)
      .pipe(
        filter((sortedMaterials) => !!sortedMaterials),
        map((sortedMaterials) =>
          NyuszkoProduct.setUpMaterials(sortedMaterials)
        ),
        tap((product) => {
          this.product = product;
          this.createForm(product);
        }),
        switchMap(() => this.builderForm.valueChanges),
        tap((changes) => {
          this.price = this.productService.getProductPrice(changes);
        })
      )
      .subscribe();
  }

  public onSubmit(): void {
    if (!this.builderForm.valid) return;
    const item = { ...this.builderForm.value, price: this.price };
    this.shoppingCartService.addBuiltProductToCart(item);
  }

  private createForm(product: NyuszkoProduct): void {
    this.builderForm = new FormGroup({
      baseMaterials: new FormGroup({
        baseProduct: new FormControl(product.baseProduct),
        baseColor: new FormControl(
          product.baseColor[0].name,
          Validators.required
        ),
        earsColor: new FormControl(
          product.earsColor[0].name,
          Validators.required
        ),
        ribbonColor: new FormControl(
          product.ribbonColor[0].name,
          Validators.required
        )
      }),
      extraOptions: new FormGroup({
        extraMinkyEarsCheckbox: new FormControl(false, Validators.required),
        extraMinkyEarsInput: new FormControl(product.extraMinkyEars[0].name),
        nameEmbroideryCheckbox: new FormControl(false, Validators.required),
        nameEmbroideryInput: new FormControl(''),
        productComment: new FormControl('')
      })
    });

    this.price = this.productService.getProductPrice(this.builderForm.value);
  }
}
