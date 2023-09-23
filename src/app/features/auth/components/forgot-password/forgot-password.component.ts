/* eslint-disable no-useless-escape */
import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Title, Meta } from '@angular/platform-browser';

import { tap } from 'rxjs';

import { AuthService } from '@core/services/auth.service';
import { ToastrService } from '@core/services/toastr.service';
import { emailRegex } from '@shared/util/email-regex';

@Component({
  selector: 'mhd-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {
  forgotPasswordForm = this.fb.group({
    email: ['', [Validators.required, Validators.pattern(emailRegex)]]
  });

  isEmailSent = false;

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private titleService: Title,
    private metaService: Meta
  ) {
    this.titleService.setTitle('Nyuszkó Kuckó | Elfelejtett jelszó');
    this.metaService.addTags([
      {
        name: 'description',
        content: 'Elfelejtett jelszó.'
      },
      {
        name: 'keywords',
        content:
          'új jelszó kérése, elfelejtett jelszó, babák, nyuszi, nyuszik, nyuszkó, nyuszkók, maci, macik, mackók, szundikendő, szundikendők, kézzel készített, webshop'
      },
      {
        property: 'og:title',
        content: 'Nyuszkó Kuckó | Elfelejtett jelszó'
      },
      {
        property: 'og:description',
        content: 'Elfelejtett jelszó.'
      },
      {
        property: 'og:image',
        content: 'https://nyuszkokucko.hu/assets/images/nyuszko-kucko-logo.png'
      },
      { name: 'robots', content: 'index, follow' },
      { name: 'author', content: 'Nyuszkó Kuckó' }
    ]);
  }

  onSubmit(): void {
    if (this.forgotPasswordForm.valid) {
      const email = this.forgotPasswordForm.value.email.trim();

      this.authService
        .forgotPassword$(email)
        .pipe(
          tap(() => {
            this.toastr.success('Az emailt elküldtük');
            this.isEmailSent = true;
          })
        )
        .subscribe();
    }
  }
}
