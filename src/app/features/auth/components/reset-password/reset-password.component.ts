import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { filter, tap } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'mhd-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  public resetPasswordForm: FormGroup;
  public resetToken: string;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private messageService: MessageService
  ) {}

  public ngOnInit(): void {
    this.route.params
      .pipe(
        filter((params) => !!params),
        tap((params) => {
          this.resetToken = params['token'];
        })
      )
      .subscribe();

    this.resetPasswordForm = new FormGroup({
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8)
      ]),
      passwordConfirm: new FormControl('', Validators.required)
    });
  }

  public onSubmit() {
    if (!this.resetPasswordForm.valid) return;
    const { password, passwordConfirm } = this.resetPasswordForm.value;
    this.authService
      .resetPassword$(password, passwordConfirm, this.resetToken)
      .pipe(
        tap(() => {
          this.messageService.add({
            severity: 'success',
            summary: 'Siker!',
            detail: 'Új jelszó beállítva.'
          });
        })
      )
      .subscribe();
  }
}
