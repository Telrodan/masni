import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { Subject, takeUntil, tap, forkJoin } from 'rxjs';
import { MessageService } from 'primeng/api';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';

import { Material } from 'src/app/core/models/material.model';
import { SortedMaterials } from 'src/app/core/models/sorted-materials.model';
import { MaterialService } from 'src/app/core/services/material.service';
import { NyuszkoSzundikendoProduct } from 'src/app/core/models/custom-products/nyuszko-szundikendo-product.model';
import { OrderService } from 'src/app/core/services/order.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { ProductService } from 'src/app/core/services/product.service';

@Component({
  selector: 'masni-handmade-dolls-nyuszko-szundikendo-builder',
  templateUrl: './nyuszko-szundikendo-builder.component.html',
  styleUrls: ['./nyuszko-szundikendo-builder.component.scss']
})
export class NyuszkoSzundikendoBuilderComponent implements OnInit, OnDestroy {
  public isAuthenticated = false;
  public nyuszkoSzundikendoBuilderForm: FormGroup;
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
          this.product = NyuszkoSzundikendoProduct.setUpMaterials(
            this.sortedMaterials
          );
          this.createForm();
          this.price = this.productService.getProductPrice(
            this.nyuszkoSzundikendoBuilderForm.value,
            this.materials
          );
          this.nyuszkoSzundikendoBuilderForm.valueChanges.subscribe(
            (changes) => {
              this.price = this.productService.getProductPrice(
                changes,
                this.materials
              );
            }
          );
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

  public onSubmit() {
    if (!this.nyuszkoSzundikendoBuilderForm.valid) return;

    this.orderService
      .addOrderToCart(this.nyuszkoSzundikendoBuilderForm, this.price)
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
        this.nyuszkoSzundikendoBuilderForm.reset();
      });
  }

  private createForm(): void {
    this.nyuszkoSzundikendoBuilderForm = new FormGroup({
      baseMaterials: new FormGroup({
        baseProduct: new FormControl(this.product.baseProduct),
        baseColor: new FormControl('', Validators.required),
        szundikendoColor: new FormControl('', Validators.required),
        minkyColorBack: new FormControl('', Validators.required)
      }),
      extraOptions: new FormGroup({
        nameEmbroideryCheckbox: new FormControl(false, Validators.required),
        nameEmbroideryInput: new FormControl(''),
        orderComment: new FormControl('')
      })
    });
  }
}
