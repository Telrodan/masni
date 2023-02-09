import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { MessageService } from 'primeng/api';

import { AuthService } from 'src/app/core/services/auth.service';
import { SpinnerService } from 'src/app/core/services/spinner.service';

@Component({
  selector: 'masni-handmade-dolls-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  public signupForm: FormGroup;
  public isSuccess = false;

  constructor(
    private authService: AuthService,
    private spinnerService: SpinnerService,
    private messageService: MessageService,
    private router: Router
  ) {}

  public ngOnInit(): void {
    this.createForm();
  }

  public onSignup(): void {
    if (!this.signupForm.valid) return;
    const newUser = { ...this.signupForm.value };
    this.isSuccess = true;
    this.spinnerService.startSpinner();
    this.authService.signupUser(newUser).subscribe(() => {
      this.spinnerService.stopSpinner();
      this.messageService.add({
        severity: 'success',
        summary: 'Sikeres regisztráció',
        detail: 'Átirányítás a főoldalra...'
      });
      setTimeout(() => {
        this.router.navigate(['/']);
      }, 2000);
    });
    this.signupForm.reset();
  }

  public createForm() {
    // eslint-disable-next-line no-useless-escape
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    const phoneRegex = /^06[0-9]{9}$/;

    this.signupForm = new FormGroup({
      name: new FormControl(null, Validators.required),
      email: new FormControl(null, [
        Validators.required,
        Validators.pattern(emailRegex)
      ]),
      phone: new FormControl(null, [
        Validators.required,
        Validators.pattern(phoneRegex)
      ]),
      password: new FormControl(null, [
        Validators.required,
        Validators.minLength(8)
      ]),
      passwordConfirm: new FormControl(null, Validators.required),
      street: new FormControl(null, Validators.required),
      city: new FormControl(null, Validators.required),
      postalcode: new FormControl(null, Validators.required),
      county: new FormControl(null, Validators.required),
      privacy: new FormControl(false, Validators.requiredTrue),
      subscribe: new FormControl(false, Validators.required)
    });
  }
}