import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthData } from 'src/app/core/models/auth-data.model';
import { AuthService } from 'src/app/core/services/auth.service';
import { SpinnerService } from 'src/app/core/services/spinner.service';

@Component({
  selector: 'masni-handmade-dolls-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public loginForm: FormGroup;

  constructor(
    private authService: AuthService,
    private messageService: MessageService,
    private spinnerService: SpinnerService,
    private router: Router
  ) {}

  public ngOnInit(): void {
    this.createForm();
  }

  public onLogin(): void {
    if (!this.loginForm.valid) return;
    const authData: AuthData = { ...this.loginForm.value };
    this.spinnerService.startSpinner();
    this.authService.loginUser(authData).subscribe((result) => {
      this.spinnerService.stopSpinner();
      this.messageService.add({
        severity: 'success',
        summary: 'Sikeres belépés',
        detail: 'Átirányítva a főoldalra'
      });
      this.router.navigate(['/']);
    });
    this.loginForm.reset();
  }

  public createForm(): void {
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

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
