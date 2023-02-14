import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { forkJoin, Subject, takeUntil, tap } from 'rxjs';
import { MessageService } from 'primeng/api';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';

import { Material } from 'src/app/core/models/material.model';
import { SortedMaterials } from 'src/app/core/models/sorted-materials.model';
import { MaterialService } from 'src/app/core/services/material.service';
import { NyuszkoProduct } from 'src/app/core/models/custom-products/nyuszko-product.model';
import { OrderService } from 'src/app/core/services/order.service';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'masni-handmade-dolls-nyuszko-builder',
  templateUrl: './nyuszko-builder.component.html',
  styleUrls: ['./nyuszko-builder.component.scss']
})
export class NyuszkoBuilderComponent implements OnInit, OnDestroy {
  public isAuthenticated = false;
  public nyuszkoBuilderForm: FormGroup;
  public product: NyuszkoProduct;
  public price = 0;
  public materials: Material[];
  public sortedMaterials: SortedMaterials;
  public productImages = [
    '../../../../assets/images/nyuszko-shop/nyuszko-builder/image-1.jpg',
    '../../../../assets/images/nyuszko-shop/nyuszko-builder/image-2.jpg',
    '../../../../assets/images/nyuszko-shop/nyuszko-builder/image-3.jpg',
    '../../../../assets/images/nyuszko-shop/nyuszko-builder/image-4.jpg',
    '../../../../assets/images/nyuszko-shop/nyuszko-builder/image-5.jpg'
  ];
  public faShoppingCart = faShoppingCart;
  private destroy = new Subject();

  constructor(
    private materialService: MaterialService,
    private orderService: OrderService,
    private messageService: MessageService,
    private authService: AuthService
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
          this.product = NyuszkoProduct.setUpMaterials(this.sortedMaterials);
          this.createForm();
          this.getProductPrice(this.nyuszkoBuilderForm.value);

          this.nyuszkoBuilderForm.valueChanges.subscribe((changes) => {
            this.getProductPrice(changes);
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

  public getProductPrice(formValues: any): void {
    this.price = 0;
    for (const key in formValues.baseMaterials) {
      const extraPrice = this.materialService.getExtraPriceById(
        formValues.baseMaterials[key],
        this.materials
      );
      this.price += extraPrice;
    }
    this.price += formValues.extraOptions?.extraMinkyEarCheckbox ? 400 : 0;
    this.price += formValues.extraOptions?.nameEmbroideryCheckbox ? 500 : 0;
  }

  public onSubmit(): void {
    if (!this.nyuszkoBuilderForm.valid) return;

    this.orderService
      .addOrderToCart(this.nyuszkoBuilderForm, this.price)
      .subscribe(() => {
        const productName = this.materialService.getMaterialNameById(
          this.product.baseProduct,
          this.materials
        );

        this.messageService.add({
          severity: 'success',
          summary: 'Siker!',
          detail: `${productName + `hozzáadva, ${this.price} Ft értékben.`}`
        });
      });
  }

  private createForm(): void {
    this.nyuszkoBuilderForm = new FormGroup({
      baseMaterials: new FormGroup({
        baseProduct: new FormControl(this.product.baseProduct),
        baseColor: new FormControl('', Validators.required),
        ears: new FormControl('', Validators.required),
        ribbon: new FormControl('', Validators.required)
      }),
      extraOptions: new FormGroup({
        extraMinkyEarCheckbox: new FormControl(false, Validators.required),
        extraMinkyEarInput: new FormControl(''),
        nameEmbroideryCheckbox: new FormControl(false, Validators.required),
        nameEmbroideryInput: new FormControl(''),
        orderComment: new FormControl('')
      })
    });
  }
}
