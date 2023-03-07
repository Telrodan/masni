import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { Store } from '@ngrx/store';
import { Subject, takeUntil, tap, switchMap } from 'rxjs';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';

import coreSelectors from 'src/app/core/core-ngrx/selectors';
import { SortedMaterials } from 'src/app/core/models/sorted-materials.model';
import { NyuszkoProduct } from 'src/app/core/models/custom-products/nyuszko-product.model';
import { OrderService } from 'src/app/core/services/order.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { ProductService } from 'src/app/core/services/product.service';

@Component({
  selector: 'masni-handmade-dolls-nyuszko-builder',
  templateUrl: './nyuszko-builder.component.html',
  styleUrls: ['./nyuszko-builder.component.scss']
})
export class NyuszkoBuilderComponent implements OnInit, OnDestroy {
  public isAuthenticated = false;
  public builderForm: FormGroup = new FormGroup({});
  public product: NyuszkoProduct;
  public price = 0;
  public sortedMaterials: SortedMaterials;
  public productImages = [
    '../../../../assets/images/nyuszko-shop/nyuszko-builder/image-1.jpg',
    '../../../../assets/images/nyuszko-shop/nyuszko-builder/image-2.jpg',
    '../../../../assets/images/nyuszko-shop/nyuszko-builder/image-3.jpg',
    '../../../../assets/images/nyuszko-shop/nyuszko-builder/image-4.jpg',
    '../../../../assets/images/nyuszko-shop/nyuszko-builder/image-5.jpg'
  ];
  public faShoppingCart = faShoppingCart;
  private destroy = new Subject<void>();

  constructor(
    private store$: Store,
    private orderService: OrderService,
    private authService: AuthService,
    private productService: ProductService
  ) {}

  public ngOnInit(): void {
    this.authService
      .getAuthStatus$()
      .pipe(takeUntil(this.destroy))
      .subscribe((response) => {
        this.isAuthenticated = response;
      });

    this.store$
      .select(coreSelectors.selectSortedMaterials)
      .pipe(
        tap((sortedMaterials) => {
          if (!sortedMaterials) return;
          this.sortedMaterials = sortedMaterials;
          this.product = NyuszkoProduct.setUpMaterials(this.sortedMaterials);
          this.createForm();
        }),
        switchMap(() => this.builderForm.valueChanges),
        tap(
          (changes) =>
            (this.price = this.productService.getProductPrice(changes))
        ),
        takeUntil(this.destroy)
      )
      .subscribe();
  }

  public ngOnDestroy(): void {
    this.destroy.next();
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
        extraMinkyEarCheckbox: new FormControl(false, Validators.required),
        extraMinkyEarInput: new FormControl(
          this.sortedMaterials.plainCotton[0].id
        ),
        nameEmbroideryCheckbox: new FormControl(false, Validators.required),
        nameEmbroideryInput: new FormControl(''),
        orderComment: new FormControl('')
      })
    });
    this.price = this.productService.getProductPrice(this.builderForm.value);
  }
}
