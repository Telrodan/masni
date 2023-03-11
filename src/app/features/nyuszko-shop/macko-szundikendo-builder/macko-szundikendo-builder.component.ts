import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { Subject, takeUntil, tap, forkJoin, switchMap } from 'rxjs';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';

import { MaterialInterface } from 'src/app/core/models/material.model';
import { SortedMaterials } from 'src/app/core/models/sorted-materials.model';
import { OrderService } from 'src/app/core/services/order.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { ProductService } from 'src/app/core/services/product.service';
import { MackoSzundikendoProduct } from 'src/app/core/models/custom-products/macko-szundikendo.model';
import { Store } from '@ngrx/store';
import coreSelectors from 'src/app/core/store/selectors';

@Component({
  selector: 'masni-handmade-dolls-szundikendo-builder',
  templateUrl: './macko-szundikendo-builder.component.html',
  styleUrls: ['./macko-szundikendo-builder.component.scss']
})
export class MackoSzundikendoBuilderComponent implements OnInit, OnDestroy {
  public isAuthenticated = false;
  public builderForm: FormGroup;
  public product: MackoSzundikendoProduct;
  public price = 0;
  public materials: MaterialInterface[];
  public sortedMaterials: SortedMaterials;
  public productImages = [
    '../../../../assets/images/nyuszko-shop/macko-szundikendo-builder/image-1.jpg',
    '../../../../assets/images/nyuszko-shop/macko-szundikendo-builder/image-2.jpg',
    '../../../../assets/images/nyuszko-shop/macko-szundikendo-builder/image-3.jpg'
  ];
  public faShoppingCart = faShoppingCart;
  private destroy = new Subject();

  constructor(
    private store$: Store,
    private orderService: OrderService,
    private authService: AuthService,
    private productService: ProductService
  ) {}

  public ngOnInit(): void {
    forkJoin([
      this.store$.select(coreSelectors.selectMaterials),
      this.store$.select(coreSelectors.selectSortedMaterials)
    ])
      .pipe(
        tap(([materials, sortedMaterials]) => {
          this.materials = materials;
          this.sortedMaterials = sortedMaterials;
          this.product = MackoSzundikendoProduct.setUpMaterials(
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

    this.authService
      .getAuthStatus$()
      .pipe(takeUntil(this.destroy))
      .subscribe((response) => {
        this.isAuthenticated = response;
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
          this.sortedMaterials.plainCotton[0]._id,
          Validators.required
        ),
        szundikendoColor: new FormControl(
          this.sortedMaterials.plainCotton[0]._id,
          Validators.required
        ),
        minkyColorBack: new FormControl(
          this.sortedMaterials.minkyPlus[0]._id,
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
