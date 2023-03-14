import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { Store } from '@ngrx/store';
import { filter, map, Observable, switchMap, tap } from 'rxjs';

import { AuthService } from '@core/services/auth.service';
import { ProductService } from '@core/services/product.service';
import { ShoppingCartService } from '@core/services/shopping-cart.service';
import { productByIdSelector } from '@core/store';
import { Product } from '@core/models/product.model';
import { formatNameInput } from '../../util/input-formatter';

@Component({
  selector: 'masni-handmade-dolls-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {
  public product: Product;
  public price = 0;
  public builderForm: FormGroup = new FormGroup({});
  public isAuthenticated$: Observable<boolean>;

  public images = [
    '../../../../assets/images/nyuszko-shop/nyuszko-builder/image-1.jpg',
    '../../../../assets/images/nyuszko-shop/nyuszko-builder/image-2.jpg',
    '../../../../assets/images/nyuszko-shop/nyuszko-builder/image-3.jpg',
    '../../../../assets/images/nyuszko-shop/nyuszko-builder/image-4.jpg'
  ];
  public faShoppingCart = faShoppingCart;

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private store$: Store,
    private shoppingCartService: ShoppingCartService,
    private productService: ProductService
  ) {}

  public ngOnInit(): void {
    this.isAuthenticated$ = this.authService.getAuthStatus$();
    this.route.params
      .pipe(
        map((params) => params['id']),
        switchMap((productId) =>
          this.store$.select(productByIdSelector(productId))
        ),
        filter((product) => !!product),
        tap((product) => {
          this.product = product;
          this.createForm(this.product);
        }),
        switchMap(() => this.builderForm.valueChanges),
        tap(
          (changes) =>
            (this.price = this.productService.getProductPrice(changes))
        )
      )
      .subscribe();
  }

  public onSubmit(product: Product): void {
    if (!this.builderForm.valid) return;

    const name = formatNameInput(
      this.builderForm.get('nameEmbroideryInput').value
    );

    const item: Product = {
      ...product,
      price: this.price,
      details: {
        nameEmbroideryCheckbox: this.builderForm.get('nameEmbroideryCheckbox')
          .value,
        nameEmbroideryInput: name,
        comment: this.builderForm.get('comment').value
      }
    };

    this.shoppingCartService.addReadyProductToCart(item);
  }

  private createForm(product: Product): void {
    this.builderForm = new FormGroup({
      baseProduct: new FormControl(product.baseProduct),
      nameEmbroideryCheckbox: new FormControl(false, Validators.required),
      nameEmbroideryInput: new FormControl(''),
      comment: new FormControl('')
    });

    this.price = this.productService.getProductPrice(this.builderForm.value);
    console.log(this.price);
  }

  // public getProductDetails(): void {
  //   const currentUrl = this.location.path();
  //   const urlSegments = currentUrl.split('/');
  //   const lastSegment = urlSegments[urlSegments.length - 1];
  //   const details = this.detailsArr.find(
  //     (item: ProductDetails) => item.slug === lastSegment
  //   );
  //   if (details) {
  //     this.productDetails = details;
  //   }
  // }
}
