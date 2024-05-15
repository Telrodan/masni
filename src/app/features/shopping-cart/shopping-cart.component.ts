import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    HostBinding,
    Input,
    OnChanges,
    OnInit,
    Output,
    SimpleChange,
    SimpleChanges,
    ViewEncapsulation
} from '@angular/core';
import {
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

import {
    filter,
    map,
    Observable,
    tap,
    switchMap,
    combineLatest,
    startWith,
    Subject
} from 'rxjs';

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
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { AuthService } from '@core/services/auth.service';

@Component({
    selector: 'nyk-shopping-cart',
    standalone: true,
    imports: [
        CommonModule,
        DropdownModule,
        ReactiveFormsModule,
        SpinnerComponent
    ],
    templateUrl: './shopping-cart.component.html',
    styleUrls: ['./shopping-cart.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShoppingCartComponent implements OnInit, OnChanges {
    @HostBinding('class') hostClass = 'nyk-shopping-cart';

    @Input() isShoppingCartOpen = false;

    @Output() closeShoppingCart = new EventEmitter<void>();

    isAuthenticated$: Observable<boolean>;

    shoppingCartData: ShoppingCartData;
    user: User;

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

    readonly refreshShoppingCart$ = new Subject<void>();

    constructor(
        private orderService: OrderService,
        private shoppingCartService: ShoppingCartService,
        private toastr: ToastrService,
        private dialog: MatDialog,
        private foxpostService: FoxpostService,
        private stripeService: StripeService,
        private changeDetectorRef: ChangeDetectorRef,
        private authService: AuthService
    ) {}

    ngOnInit(): void {
        this.isAuthenticated$ = this.authService.getAuthStatus$();

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

    ngOnChanges(changes: { isShoppingCartOpen: SimpleChange }): void {
        if (changes.isShoppingCartOpen) {
            if (this.isShoppingCartOpen) {
                this.shoppingCartService
                    .getItems$()
                    .pipe(
                        tap((cartItems) => {
                            this.shoppingCartData = {
                                items: cartItems,
                                price: cartItems
                                    .map((item) => item.price)
                                    .reduce((a, b) => a + b, 0)
                            };
                            this.changeDetectorRef.markForCheck();
                        })
                    )
                    .subscribe();
            }
        }
    }

    onCloseShoppingCart(): void {
        this.closeShoppingCart.emit();
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
                switchMap(() => this.shoppingCartService.deleteItem$(item)),
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

    trackById(index: number, item: ShoppingCartItem): string {
        return item.id;
    }
}
