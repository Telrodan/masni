import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { tap } from 'rxjs';

import { User } from '@core/models/user.model';
import { ToastrService } from '@core/services/toastr.service';
import { AuthService } from '@core/services/auth.service';
import { PostcodeApiService } from '@core/services/postcode-api.service';
import { emailRegex } from '@shared/util/email-regex';
import { phoneRegex } from '@shared/util/phone-regex';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'mhd-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {
  signupForm = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.pattern(emailRegex)]],
    phone: ['', [Validators.required, Validators.pattern(phoneRegex)]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    passwordConfirm: ['', Validators.required],
    shippingStreet: ['', Validators.required],
    shippingCity: ['', Validators.required],
    shippingPostcode: [null, Validators.required],
    shippingCounty: ['', Validators.required],
    billingStreet: ['', Validators.required],
    billingCity: ['', Validators.required],
    billingPostcode: [null, Validators.required],
    billingCounty: ['', Validators.required],
    privacy: [false, Validators.requiredTrue],
    subscribed: [false, Validators.required]
  });

  constructor(
    private authService: AuthService,
    private toastr: ToastrService,
    private postcodeApiService: PostcodeApiService,
    private fb: FormBuilder,
    private router: Router,
    private titleService: Title,
    private metaService: Meta
  ) {
    this.titleService.setTitle('Nyuszkó Kuckó | Regisztráció');
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
        content: 'Nyuszkó Kuckó | Regisztráció'
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

  onSignup(): void {
    if (this.signupForm.valid) {
      const user: User = {
        name: this.signupForm.value.name,
        email: this.signupForm.value.email,
        phone: this.signupForm.value.phone,
        password: this.signupForm.value.password,
        passwordConfirm: this.signupForm.value.passwordConfirm,
        shippingAddress: {
          street: this.signupForm.value.shippingStreet,
          city: this.signupForm.value.shippingCity,
          county: this.signupForm.value.shippingCounty,
          postcode: this.signupForm.value.shippingPostcode
        },
        billingAddress: {
          street: this.signupForm.value.billingStreet,
          city: this.signupForm.value.billingCity,
          county: this.signupForm.value.billingCounty,
          postcode: this.signupForm.value.billingPostcode
        },
        subscribed: this.signupForm.value.subscribed
      };

      this.authService
        .signup$(user)
        .pipe(
          tap(() => {
            this.toastr.success('Sikeres regisztráció, átirányítva a főoldra');
            this.signupForm.reset();
            this.router.navigate(['/']);
          })
        )
        .subscribe();
    }
  }

  onShippingPostcodeBlur(event: Event): void {
    if (this.signupForm.get('shippingPostcode').valid) {
      const postcode = Number((event.target as HTMLInputElement).value);

      this.postcodeApiService
        .getPostcodeInformation$(postcode)
        .pipe(
          tap((place) => {
            this.signupForm.get('shippingCity').setValue(place['place name']);
            this.signupForm.get('shippingCounty').setValue(place.state);
          })
        )
        .subscribe();
    }
  }

  onBillingPostcodeBlur(event: Event): void {
    if (this.signupForm.get('billingPostcode').valid) {
      const postcode = Number((event.target as HTMLInputElement).value);

      this.postcodeApiService
        .getPostcodeInformation$(postcode)
        .pipe(
          tap((place) => {
            this.signupForm.get('billingCity').setValue(place['place name']);
            this.signupForm.get('billingCounty').setValue(place.state);
          })
        )
        .subscribe();
    }
  }
}
