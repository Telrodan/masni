import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { Subject, takeUntil, tap, forkJoin, switchMap } from 'rxjs';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';

import { Material } from 'src/app/core/models/material.model';
import { SortedMaterials } from 'src/app/core/models/sorted-materials.model';
import { MaterialService } from 'src/app/core/services/material.service';
import { NyuszkoSzundikendoProduct } from 'src/app/core/models/custom-products/nyuszko-szundikendo-product.model';
import { OrderService } from 'src/app/core/services/order.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { ProductService } from 'src/app/core/services/product.service';
import { Store } from '@ngrx/store';
import coreSelectors from 'src/app/core/core-ngrx/selectors';

@Component({
  selector: 'masni-handmade-dolls-nyuszko-szundikendo-builder',
  templateUrl: './nyuszko-szundikendo-builder.component.html',
  styleUrls: ['./nyuszko-szundikendo-builder.component.scss']
})
export class NyuszkoSzundikendoBuilderComponent implements OnInit, OnDestroy {
  public isAuthenticated = false;
  public builderForm: FormGroup;
  public product: NyuszkoSzundikendoProduct;
  public price = 0;
  public materials: Material[];
  public sortedMaterials: SortedMaterials;
  public productImages = [
    '../../../../assets/images/nyuszko-shop/nyuszko-szundikendo-builder/image-1.jpg',
    '../../../../assets/images/nyuszko-shop/nyuszko-szundikendo-builder/image-2.jpg',
    '../../../../assets/images/nyuszko-shop/nyuszko-szundikendo-builder/image-3.jpg',
    '../../../../assets/images/nyuszko-shop/nyuszko-szundikendo-builder/image-4.jpg',
    '../../../../assets/images/nyuszko-shop/nyuszko-szundikendo-builder/image-5.jpg'
  ];
  public faShoppingCart = faShoppingCart;
  private destroy = new Subject();

  constructor(
    private materialService: MaterialService,
    private orderService: OrderService,
    private authService: AuthService,
    private productService: ProductService,
    private store$: Store
  ) {}

  public ngOnInit(): void {
    this.authService
      .getAuthStatus$()
      .pipe(takeUntil(this.destroy))
      .subscribe((response) => {
        this.isAuthenticated = response;
      });

    forkJoin([
      this.store$.select(coreSelectors.selectMaterials),
      this.store$.select(coreSelectors.selectSortedMaterials)
    ])
      .pipe(
        tap(([materials, sortedMaterials]) => {
          this.materials = materials;
          this.sortedMaterials = sortedMaterials;
          this.product = NyuszkoSzundikendoProduct.setUpMaterials(
            this.sortedMaterials
          );
          this.createForm();
          this.price = this.productService.getProductPrice(
            this.builderForm.value
          );
        }),
        switchMap(() => this.builderForm.valueChanges),
        takeUntil(this.destroy)
      )
      .subscribe((changes) => {
        this.price = this.productService.getProductPrice(changes);
      });
  }

  public ngOnDestroy(): void {
    this.destroy.next(null);
    this.destroy.complete();
  }

  public onSubmit() {
    if (!this.builderForm.valid) return;
    this.orderService.addOrderToCart(this.builderForm, this.price);
  }

  private createForm(): void {
    this.builderForm = new FormGroup({
      baseMaterials: new FormGroup({
        baseProduct: new FormControl(this.product.baseProduct),
        baseColor: new FormControl(
          this.sortedMaterials.plainCotton[0].id,
          Validators.required
        ),
        szundikendoColor: new FormControl(
          this.sortedMaterials.plainCotton[0].id,
          Validators.required
        ),
        minkyColorBack: new FormControl(
          this.sortedMaterials.minkyPlus[0].id,
          Validators.required
        )
      }),
      extraOptions: new FormGroup({
        nameEmbroideryCheckbox: new FormControl(false, Validators.required),
        nameEmbroideryInput: new FormControl(''),
        orderComment: new FormControl('')
      })
    });
  }
}
