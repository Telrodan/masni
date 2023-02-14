import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { forkJoin, Subject, takeUntil, tap } from 'rxjs';
import { MessageService } from 'primeng/api';
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
  public mackoBuilderForm: FormGroup;
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
    private messageService: MessageService,
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
        takeUntil(this.destroy),
        tap(([materials, sortedMaterials]) => {
          this.materials = materials;
          this.sortedMaterials = sortedMaterials;
          this.product = MackoProduct.setUpMaterials(this.sortedMaterials);
          this.createForm();
          this.price = this.productService.getProductPrice(
            this.mackoBuilderForm.value,
            this.materials
          );
          this.mackoBuilderForm.valueChanges.subscribe((changes) => {
            this.price = this.productService.getProductPrice(
              changes,
              this.materials
            );
          });
        })
      )
      .subscribe();

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
    if (!this.mackoBuilderForm.valid) return;
    this.orderService
      .addOrderToCart(this.mackoBuilderForm, this.price)
      .subscribe(() => {
        const productName = this.materialService.getMaterialNameById(
          this.product.baseProduct,
          this.materials
        );
        this.messageService.add({
          severity: 'success',
          summary: 'Siker!',
          detail: `${productName + ` hozzáadva, ${this.price} Ft értékben.`}`
        });
        this.mackoBuilderForm.reset();
      });
  }

  private createForm(): void {
    this.mackoBuilderForm = new FormGroup({
      baseMaterials: new FormGroup({
        baseProduct: new FormControl(this.product.baseProduct),
        baseColor: new FormControl('', Validators.required),
        ears: new FormControl('', Validators.required),
        ribbon: new FormControl('', Validators.required)
      }),
      extraOptions: new FormGroup({
        nameEmbroideryCheckbox: new FormControl(false, Validators.required),
        nameEmbroideryInput: new FormControl(''),
        orderComment: new FormControl('')
      })
    });
  }
}
