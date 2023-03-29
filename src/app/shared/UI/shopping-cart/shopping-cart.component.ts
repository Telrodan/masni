import { Component, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';
import { filter, map, Observable, tap, switchMap } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';

import { ShoppingCartItem } from '@core/models/shopping-cart-item.model';
import { shoppingCartItemsSelector } from '@core/store/selectors/shopping-cart.selectors';
import { ShoppingCartService } from '@core/services/shopping-cart.service';
import { ToastrService } from '@core/services/toastr.service';
import { environment } from 'src/environments/environment';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

interface ShoppingCartData {
  items: ShoppingCartItem[];
  price: number;
}

@Component({
  selector: 'masni-handmade-dolls-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.scss']
})
export class ShoppingCartComponent implements OnInit {
  shoppingCartData$: Observable<ShoppingCartData>;
  productImagesUrl = environment.productImagesUrl;

  constructor(
    private shoppingCartService: ShoppingCartService,
    private toastr: ToastrService,
    private store$: Store,
    private dialog: MatDialog
  ) {}

  public ngOnInit(): void {
    this.shoppingCartData$ = this.store$.select(shoppingCartItemsSelector).pipe(
      filter((items) => !!items),
      map((items) => {
        let price = 0;
        items.map((item) => {
          price += item.price;
        });

        return {
          items,
          price
        };
      })
    );
  }

  onDeleteOrder(item: ShoppingCartItem): void {
    const productName =
      item.product['name'].charAt(0).toUpperCase() +
      item.product['name'].slice(1);

    this.dialog
      .open(ConfirmDialogComponent, {
        data: {
          title: 'Megerősítés',
          message: `Biztos törölni szeretnéd ${productName} terméket, ${item.price} Ft értékben?`,
          confirmButtonText: 'Igen',
          cancelButtonText: 'Nem'
        }
      })
      .afterClosed()
      .pipe(
        filter((confirmed) => !!confirmed),
        switchMap(() => this.shoppingCartService.deleteItemFromCart(item)),
        tap(() => {
          this.toastr.success('Siker', `${productName} törölve`);
        })
      )
      .subscribe();
  }
}
