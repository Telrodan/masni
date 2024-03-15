import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

import {
    filter,
    map,
    Observable,
    tap,
    switchMap,
    combineLatest,
    startWith
} from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { ShoppingCartItem } from '@core/models/shopping-cart-item.model';
import { ShoppingCartService } from '@core/services/shopping-cart.service';
import { ToastrService } from '@core/services/toastr.service';
import { ShoppingCartData } from '@core/models/shopping-cart-data.model';
import { OrderService } from '@core/services/order.service';
import { User } from '@core/models/user.model';
import { FoxpostService } from '@core/services/foxpost.service';
import { ConfirmDialogComponent } from '@shared/components/confirm-dialog/confirm-dialog.component';
import { StripeService } from '@core/services/stripe.service';
import { ShippingDetails } from '@core/models/shipping-details.model';
import { ShippingOption } from '@core/models/shipping-option.model';

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

    shippingMethods: ShippingOption[] = [
        {
            name: 'Foxpost automata +1200 Ft',
            method: 'foxpost-collection',
            price: 1200
        },
        {
            name: 'Házhozszállítás +2490 Ft',
            method: 'delivery',
            price: 2490
        },
        {
            name: 'Szemelyés átvétel (Szentes) +0 Ft ',
            method: 'personal-collection',
            price: 0
        }
    ];

    constructor(
        private orderService: OrderService,
        private shoppingCartService: ShoppingCartService,
        private toastr: ToastrService,
        private dialog: MatDialog,
        private foxpostService: FoxpostService,
        private stripeService: StripeService
    ) {}

    public ngOnInit(): void {
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
    }

    onDeleteOrder(item: ShoppingCartItem): void {
        this.dialog
            .open(ConfirmDialogComponent, {
                data: {
                    message: `Biztos törölni szeretnéd ${item.product.name} terméket, ${item.price} Ft értékben?`
                }
            })
            .afterClosed()
            .pipe(
                filter((confirmed) => !!confirmed),
                switchMap(() =>
                    this.shoppingCartService.deleteItemFromCart(item)
                ),
                tap(() => {
                    this.toastr.success(`${item.product.name} törölve`);
                })
            )
            .subscribe();
    }

    onSubmitOrder(): void {
        let shipping: ShippingDetails = {};
        const billingAddress = this.user.billingAddress;
        const billing = `${billingAddress.postcode}, ${billingAddress.city} ${billingAddress.street} ${billingAddress.county}`;
        if (this.shippingForm.value.shippingMethod.method === 'delivery') {
            const userAddress = this.user.shippingAddress;
            shipping = {
                name: this.shippingForm.value.shippingMethod.name,
                price: this.shippingForm.value.shippingMethod.price,
                address: `${userAddress.postcode} ${userAddress.city}, ${userAddress.street}`,
                billing
            };
        } else if (
            this.shippingForm.value.shippingMethod.method ===
            'foxpost-collection'
        ) {
            shipping = {
                name: this.shippingForm.value.shippingMethod.name,
                price: this.shippingForm.value.shippingMethod.price,
                address: this.shippingForm.value.foxpost.address,
                billing
            };
        } else {
            shipping = {
                name: this.shippingForm.value.shippingMethod.name,
                price: this.shippingForm.value.shippingMethod.price,
                address: 'Szentes',
                billing
            };
        }

        if (shipping.address) {
            this.orderService
                .getCheckoutSession(shipping)
                .subscribe(async (res: any) => {
                    const stripe = await this.stripeService.getStripe();

                    if (stripe) {
                        stripe?.redirectToCheckout({
                            sessionId: res.data.id
                        });
                    }
                });
        } else {
            this.toastr.info('Kérlek válassz szállítási módot');
        }
    }
}
