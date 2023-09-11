import { Component, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';
import {
  filter,
  map,
  Observable,
  tap,
  switchMap,
  combineLatest,
  distinctUntilChanged,
  startWith,
  debounceTime
} from 'rxjs';
import { MatDialog } from '@angular/material/dialog';

import { ShoppingCartItem } from '@core/models/shopping-cart-item.model';
import { shoppingCartItemsSelector } from '@core/store/selectors/shopping-cart.selectors';
import { ShoppingCartService } from '@core/services/shopping-cart.service';
import { ToastrService } from '@core/services/toastr.service';
import { environment } from 'src/environments/environment';
import { ConfirmDialogComponent } from '../../shared/UI/confirm-dialog/confirm-dialog.component';
import { HttpClient } from '@angular/common/http';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { OrderService } from '@core/services/order.service';
import { User } from '@core/models/user.model';
import { userSelector } from '@core/store';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { loadStripe } from '@stripe/stripe-js';
import { FoxpostService } from '@core/services/foxpost.service';

interface ShoppingCartData {
  items: ShoppingCartItem[];
  price: number;
}

interface ShippingOption {
  method: string;
  value: string;
  price: number;
}

@UntilDestroy()
@Component({
  selector: 'mhd-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.scss']
})
export class ShoppingCartComponent implements OnInit {
  user: User;
  shoppingCartData$: Observable<ShoppingCartData>;

  shippingForm: FormGroup;
  foxpostPoints: any;

  shippingMethods = [
    {
      method: 'Házhozszállítás +2200 Ft',
      value: 'delivery',
      price: 2200
    },
    {
      method: 'Foxpost automata +1200 Ft',
      value: 'foxpost-collection',
      price: 1200
    }
  ];

  constructor(
    private orderService: OrderService,
    private shoppingCartService: ShoppingCartService,
    private toastr: ToastrService,
    private store$: Store,
    private dialog: MatDialog,
    private http: HttpClient,
    private foxpostService: FoxpostService
  ) {}

  public ngOnInit(): void {
    this.store$
      .select(userSelector)
      .pipe(
        filter((user) => !!user),
        tap((user) => {
          this.user = user;
        }),
        untilDestroyed(this)
      )
      .subscribe();

    this.shippingForm = new FormGroup({
      shippingMethod: new FormControl(
        this.shippingMethods[0],
        Validators.required
      ),
      foxpost: new FormControl('')
    });

    this.foxpostService
      .getFoxpostMachines()
      .pipe(
        tap((machines) => {
          this.foxpostPoints = machines.data;
        })
      )
      .subscribe();

    this.shoppingCartData$ = combineLatest([
      this.store$
        .select(shoppingCartItemsSelector)
        .pipe(filter((items) => !!items)),
      this.shippingForm.valueChanges.pipe(
        distinctUntilChanged(),
        map((changes) => changes.shippingMethod as ShippingOption),
        startWith(this.shippingMethods[0]),
        debounceTime(300)
      )
    ]).pipe(
      map(([items, shipping]) => {
        let price = 0;
        items.map((item) => {
          price += item.price;
        });
        price += shipping.price;
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
          this.toastr.success(`${productName} törölve`);
        })
      )
      .subscribe();
  }

  onSubmitOrder(): void {
    let shipping;
    const billing = `${this.user.billingAddress.postcode}, ${this.user.billingAddress.city} ${this.user.billingAddress.street} ${this.user.billingAddress.county}`;
    if (this.shippingForm.get('shippingMethod').value.value === 'delivery') {
      const userAddress = this.user.shippingAddress;
      shipping = {
        method: this.shippingForm.get('shippingMethod').value.method,
        price: this.shippingForm.get('shippingMethod').value.price,
        address: `${userAddress.postcode} ${userAddress.city}, ${userAddress.street}`,
        billing
      };
    } else {
      shipping = {
        method: this.shippingForm.get('shippingMethod').value.method,
        price: this.shippingForm.get('shippingMethod').value.price,
        address: this.shippingForm.get('foxpost').value.address,
        billing
      };
    }

    this.orderService
      .getCheckoutSession(shipping)
      .subscribe(async (res: any) => {
        const stripe = await loadStripe(environment.stripeKey);
        stripe?.redirectToCheckout({
          sessionId: res.data.id
        });
      });
  }
}
