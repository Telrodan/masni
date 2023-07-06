import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { tap } from 'rxjs';

import { AuthData } from 'src/app/core/models/auth-data.model';
import { AuthService } from 'src/app/core/services/auth.service';
import { ToastrService } from '@core/services/toastr.service';

@Component({
  selector: 'masni-handmade-dolls-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public loginForm: FormGroup;

  constructor(
    private authService: AuthService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.createForm();
  }

  onLogin(): void {
    if (!this.loginForm.valid) return;
    const authData: AuthData = {
      email: this.loginForm.value.email.toLowerCase().trim(),
      password: this.loginForm.value.password.trim()
    };

    this.authService
      .login$(authData)
      .pipe(
        tap(() => {
          this.toastr.success('Sikeres belépés, átirányítva a főoldra');
          this.loginForm.reset();
        })
      )
      .subscribe();
  }

  createForm(): void {
    const emailRegex = /^[\w-\\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    this.loginForm = new FormGroup({
      email: new FormControl(null, [
        Validators.required,
        Validators.pattern(emailRegex)
      ]),
      password: new FormControl(null, [
        Validators.required,
        Validators.minLength(8)
      ])
    });
  }
}
