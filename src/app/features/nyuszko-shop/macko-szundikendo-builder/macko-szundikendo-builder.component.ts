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
import { SortedMaterialsInterface } from '@core/models/sorted-materials.model';
import { MackoSzundikendoProduct } from '@core/models/custom-products/macko-szundikendo.model';

@Component({
  selector: 'masni-handmade-dolls-szundikendo-builder',
  templateUrl: './macko-szundikendo-builder.component.html',
  styleUrls: ['./macko-szundikendo-builder.component.scss']
})
export class MackoSzundikendoBuilderComponent implements OnInit {
  public isAuthenticated$: Observable<boolean>;
  public product: MackoSzundikendoProduct;
  public sortedMaterials$: Observable<SortedMaterialsInterface>;
  public price = 0;
  public builderForm: FormGroup = new FormGroup({});
  public productImages = [
    '../../../../assets/images/nyuszko-shop/macko-szundikendo-builder/image-1.jpg',
    '../../../../assets/images/nyuszko-shop/macko-szundikendo-builder/image-2.jpg',
    '../../../../assets/images/nyuszko-shop/macko-szundikendo-builder/image-3.jpg'
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
          MackoSzundikendoProduct.setUpMaterials(sortedMaterials)
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

  private createForm(product: MackoSzundikendoProduct): void {
    this.builderForm = new FormGroup({
      baseMaterials: new FormGroup({
        baseProduct: new FormControl(product.baseProduct),
        baseColor: new FormControl(
          product.baseColor[0].name,
          Validators.required
        ),
        szundikendoColor: new FormControl(
          product.szundikendoColor[0].name,
          Validators.required
        ),
        minkyColorBack: new FormControl(
          product.minkyColorBack[0].name,
          Validators.required
        )
      }),
      extraOptions: new FormGroup({
        nameEmbroideryCheckbox: new FormControl(false, Validators.required),
        nameEmbroideryInput: new FormControl(''),
        productComment: new FormControl('')
      })
    });

    this.price = this.productService.getProductPrice(this.builderForm.value);
  }
}
