import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '@core/models/user.model';

import { MessageService } from 'primeng/api';
import { catchError, tap, throwError } from 'rxjs';

import { AuthService } from 'src/app/core/services/auth.service';

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
    private messageService: MessageService,
    private router: Router,
    private http: HttpClient
  ) {}

  public ngOnInit(): void {
    this.createForm();
  }

  public onSignup(): void {
    console.log(this.signupForm.value);
    if (this.signupForm.valid) {
      const newUser = new User(this.signupForm.value);
      this.authService
        .signup$(newUser)
        .pipe(
          tap(() => {
            this.messageService.add({
              severity: 'success',
              summary: 'Sikeres regisztráció!',
              detail: 'Átirányítva a főoldalra'
            });
            this.signupForm.reset();
            this.router.navigate(['/']);
          })
        )
        .subscribe();
    }
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
      postcode: new FormControl(null, Validators.required),
      county: new FormControl(null, Validators.required),
      privacy: new FormControl(false, Validators.requiredTrue),
      subscribed: new FormControl(false, Validators.required)
    });
  }

  onPostcodeBlur(event: Event): void {
    console.log(this.signupForm.value);
    if (this.signupForm.get('postcode').valid) {
      const postcode = (event.target as HTMLInputElement).value;
      const headers = new HttpHeaders({
        'X-RapidAPI-Key': '99eb9da73dmsh0b8a6cae4b15b1ap10dd5ajsnaee21aaff256',
        'X-RapidAPI-Host': 'community-zippopotamus.p.rapidapi.com'
      });
      this.http
        .get(`https://community-zippopotamus.p.rapidapi.com/hu/${postcode}`, {
          headers
        })
        .pipe(
          catchError(() => {
            return throwError(
              () => new Error('Nem található ilyen irányítószám!')
            );
          }),
          tap((response: any) => {
            this.signupForm
              .get('city')
              .setValue(response.places[0]['place name']);
            this.signupForm.get('county').setValue(response.places[0].state);
          })
        )
        .subscribe();
    }
  }
}
