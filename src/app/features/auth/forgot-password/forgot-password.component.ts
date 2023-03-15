/* eslint-disable no-useless-escape */
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '@core/services/auth.service';
import { tap } from 'rxjs';

@Component({
  selector: 'masni-handmade-dolls-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  public forgotPasswordForm: FormGroup;
  public isEmailSent = false;

  constructor(private authService: AuthService) {}

  public ngOnInit(): void {
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    this.forgotPasswordForm = new FormGroup({
      email: new FormControl('', [
        Validators.required,
        Validators.pattern(emailRegex)
      ])
    });
  }
  public onSubmit(): void {
    if (!this.forgotPasswordForm.valid) return;
    this.authService
      .forgotPassword$(this.forgotPasswordForm.value)
      .pipe(
        tap(() => {
          this.isEmailSent = true;
        })
      )
      .subscribe();
  }
}
