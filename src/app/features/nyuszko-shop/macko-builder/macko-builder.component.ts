import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { forkJoin, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';

import { Material } from 'src/app/core/models/material.model';
import { SortedMaterials } from 'src/app/core/models/sorted-materials.model';
import { MaterialService } from 'src/app/core/services/material.service';
import { OrderService } from 'src/app/core/services/order.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { MackoProduct } from 'src/app/core/models/custom-products/macko-product';
import { ProductService } from 'src/app/core/services/product.service';

@Component({
  selector: 'masni-handmade-dolls-macko-builder',
  templateUrl: './macko-builder.component.html',
  styleUrls: ['./macko-builder.component.scss']
})
export class MackoBuilderComponent implements OnInit, OnDestroy {
  public isAuthenticated = false;
  public builderForm: FormGroup;
  public product: MackoProduct;
  public price = 0;
  public materials: Material[];
  public sortedMaterials: SortedMaterials;
  public productImages = [
    '../../../../assets/images/nyuszko-shop/test-product-image-1.jpg',
    '../../../../assets/images/nyuszko-shop/test-product-image-2.jpg',
    '../../../../assets/images/nyuszko-shop/test-product-image-3.jpg',
    '../../../../assets/images/nyuszko-shop/test-product-image-4.jpg'
  ];
  public faShoppingCart = faShoppingCart;
  private destroy = new Subject();

  constructor(
    private materialService: MaterialService,
    private orderService: OrderService,
    private authService: AuthService,
    private productService: ProductService
  ) {}

  public ngOnInit(): void {
    this.isAuthenticated = this.authService.getIsAuthenticated();

    forkJoin([
      this.materialService.getMaterials$(),
      this.materialService.getSortedMaterials$()
    ])
      .pipe(
        tap(([materials, sortedMaterials]) => {
          this.materials = materials;
          this.sortedMaterials = sortedMaterials;
          this.product = MackoProduct.setUpMaterials(this.sortedMaterials);
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

  public onSubmit(): void {
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
        earsColor: new FormControl(
          this.sortedMaterials.plainCotton[0].id,
          Validators.required
        ),
        ribbonColor: new FormControl(
          this.sortedMaterials.ribbon[0].id,
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
