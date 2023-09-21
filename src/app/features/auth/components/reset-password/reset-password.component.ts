import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { switchMap, tap } from 'rxjs';

import { AuthService } from '@core/services/auth.service';
import { ToastrService } from '@core/services/toastr.service';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'mhd-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent {
  resetPasswordForm = this.fb.group({
    password: ['', [Validators.required, Validators.minLength(8)]],
    passwordConfirm: ['', [Validators.required, Validators.minLength(8)]]
  });

  resetToken: string;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private router: Router,
    private titleService: Title,
    private metaService: Meta
  ) {
    this.titleService.setTitle('Nyuszkó Kuckó | Új jelszó');
    this.metaService.addTags([
      {
        name: 'description',
        content: 'Új jelszó beállítása.'
      },
      {
        name: 'keywords',
        content:
          'új jelszó beállítása, elfelejtett jelszó, babák, nyuszi, nyuszik, nyuszkó, nyuszkók, maci, macik, mackók, szundikendő, szundikendők, kézzel készített, webshop'
      },
      {
        property: 'og:title',
        content: 'Nyuszkó Kuckó | Új jelszó'
      },
      {
        property: 'og:description',
        content: 'Új jelszó beállítása.'
      },
      {
        property: 'og:image',
        content: 'https://nyuszkokucko.hu/assets/images/nyuszko-kucko-logo.png'
      },
      { name: 'robots', content: 'index, follow' },
      { name: 'author', content: 'Nyuszkó Kuckó' }
    ]);
  }

  onSubmit() {
    if (this.resetPasswordForm.valid) {
      const { password, passwordConfirm } = this.resetPasswordForm.value;

      this.route.params
        .pipe(
          switchMap((params) =>
            this.authService
              .resetPassword$(password, passwordConfirm, params['token'])
              .pipe(
                tap(() => {
                  this.toastr.success('Új jelszó sikeresen beállítva');
                  this.router.navigate(['/']);
                })
              )
          )
        )
        .subscribe();
    }
  }
}
