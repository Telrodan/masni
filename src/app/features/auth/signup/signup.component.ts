import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    HostBinding,
    OnDestroy,
    OnInit,
    ViewEncapsulation
} from '@angular/core';
import { CommonModule, ViewportScroller } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';

import { Subscription, catchError, filter, switchMap, tap } from 'rxjs';
import { InputTextModule } from 'primeng/inputtext';
import { InputSwitchModule } from 'primeng/inputswitch';
import { DividerModule } from 'primeng/divider';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { GoogleSigninButtonModule, SocialAuthService } from '@abacritt/angularx-social-login';

import { User } from '@core/models/user.model';
import { ToastrService } from '@core/services/toastr.service';
import { AuthService } from '@core/services/auth.service';
import { emailRegex } from '@shared/util/email-regex';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { phoneRegex } from '@shared/util/regex.util';

@Component({
    selector: 'nyk-signup',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        InputTextModule,
        InputSwitchModule,
        DividerModule,
        SpinnerComponent,
        RouterModule,
        ButtonModule,
        PasswordModule,
        GoogleSigninButtonModule
    ],
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SignupComponent implements OnInit, OnDestroy {
    @HostBinding('class.nyk-signup') hostClass = true;

    signupForm = this.fb.group({
        name: ['', Validators.required],
        email: ['', [Validators.required, Validators.pattern(emailRegex)]],
        phone: ['', [Validators.required, Validators.pattern(phoneRegex)]],
        password: ['', [Validators.required, Validators.minLength(8)]],
        passwordConfirm: ['', [Validators.required, Validators.minLength(8)]],
        shippingAddress: this.fb.group({
            street: ['', Validators.required],
            city: ['', Validators.required],
            postcode: [null, Validators.required],
            county: ['', Validators.required]
        }),
        billingAddress: this.fb.group({
            street: ['', Validators.required],
            city: ['', Validators.required],
            postcode: [null, Validators.required],
            county: ['', Validators.required]
        }),
        privacy: [false, Validators.requiredTrue],
        subscribed: [false, Validators.required]
    });

    isLoading = false;

    private authSubscription$$: Subscription;

    constructor(
        private authService: AuthService,
        private toastr: ToastrService,
        private fb: FormBuilder,
        private router: Router,
        private titleService: Title,
        private metaService: Meta,
        private viewportScroller: ViewportScroller,
        private changeDetectorRef: ChangeDetectorRef,
        private socialAuthService: SocialAuthService
    ) {
        this.titleService.setTitle('Regisztráció | Nyuszkó Kuckó');
        this.metaService.addTags([
            {
                name: 'description',
                content: 'Regisztrálás az oldalra.'
            },
            {
                name: 'keywords',
                content:
                    'regisztráció, babák, nyuszi, nyuszik, nyuszkó, nyuszkók, maci, macik, mackók, szundikendő, szundikendők, kézzel készített, webshop'
            },
            {
                property: 'og:title',
                content: 'Regisztráció | Nyuszkó Kuckó'
            },
            {
                property: 'og:description',
                content: 'Regisztrálás az oldalra.'
            },
            {
                property: 'og:image',
                content: 'https://nyuszkokucko.hu/assets/images/nyuszko-kucko-logo.png'
            },
            { name: 'robots', content: 'index, follow' },
            { name: 'author', content: 'Nyuszkó Kuckó' }
        ]);
    }

    ngOnInit(): void {
        this.authSubscription$$ = this.socialAuthService.authState
            .pipe(
                filter((user) => !!user.idToken),
                switchMap((user) =>
                    this.authService.google$(user.idToken).pipe(
                        tap(() => {
                            this.toastr.success('Regisztráció sikeres, átirányítva a főoldalra.');
                            this.router.navigate(['/']);
                        })
                    )
                )
            )
            .subscribe();
    }

    ngOnDestroy(): void {
        this.authSubscription$$.unsubscribe();
    }

    logout() {
        this.socialAuthService.signOut().then((asd) => {
            console.log('asd', asd);
        });
    }

    isFormFieldValid(form: FormGroup, controllerName: string): boolean {
        return (
            form.get(`${controllerName}`).invalid &&
            form.get(`${controllerName}`).touched &&
            form.get(`${controllerName}`).dirty
        );
    }

    arePasswordsMatches(): boolean {
        return (
            this.signupForm.get('passwordConfirm').dirty &&
            this.signupForm.get('password').value !== this.signupForm.get('passwordConfirm').value
        );
    }

    isCopyShippingAddressAvailable(): boolean {
        return (
            this.signupForm.get('shippingAddress.postcode').valid &&
            this.signupForm.get('shippingAddress.street').valid &&
            this.signupForm.get('shippingAddress.city').valid &&
            this.signupForm.get('shippingAddress.county').valid
        );
    }

    onCopyShippingAddress(): void {
        this.signupForm.patchValue({
            billingAddress: {
                ...this.signupForm.get('shippingAddress').value
            }
        });
    }

    onSignup(): void {
        if (this.signupForm.valid) {
            this.isLoading = true;
            this.viewportScroller.scrollToPosition([0, 0]);

            const user: User = {
                ...(this.signupForm.value as User),
                phone: `+36${this.signupForm.value.phone}`
            };

            this.authService
                .signup$(user)
                .pipe(
                    tap(() => {
                        this.toastr.success('Regisztráció sikeres, átirányítva a belépeshez');
                        this.router.navigate(['auth/signin']);
                    }),
                    catchError(() => {
                        this.isLoading = false;
                        this.changeDetectorRef.detectChanges();

                        return [];
                    })
                )
                .subscribe();
        }
    }

    onShippingPostcodeBlur(event: Event): void {
        if (this.signupForm.get('shippingAddress.postcode').valid) {
            const input = event.target as HTMLInputElement;
            const postcode = +input.value;

            this.authService
                .getPostcodeInformation$(postcode)
                .pipe(
                    tap((place) => {
                        this.signupForm.patchValue({
                            shippingAddress: {
                                city: place.city,
                                county: place.county
                            }
                        });
                    })
                )
                .subscribe();
        }
    }

    onBillingPostcodeBlur(event: Event): void {
        if (this.signupForm.get('billingAddress.postcode').valid) {
            const input = event.target as HTMLInputElement;
            const postcode = +input.value;

            this.authService
                .getPostcodeInformation$(postcode)
                .pipe(
                    tap((place) => {
                        this.signupForm.patchValue({
                            billingAddress: {
                                city: place.city,
                                county: place.county
                            }
                        });
                    })
                )
                .subscribe();
        }
    }
}
