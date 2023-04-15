import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { catchError, tap, throwError } from 'rxjs';

import { AuthService } from 'src/app/core/services/auth.service';
import { User } from '@core/models/user.model';
import { ToastrService } from '@core/services/toastr.service';
import { environment } from 'src/environments/environment';

interface PostCodeApiData {
  places: {
    'place name': string;
    state: string;
  }[];
}

@Component({
  selector: 'masni-handmade-dolls-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  signupForm: FormGroup;
  isSuccess = false;

  constructor(
    private authService: AuthService,
    private toastr: ToastrService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.createForm();
  }

  onSignup(): void {
    if (this.signupForm.valid) {
      const user = new User(this.signupForm.value);
      this.authService
        .signup$(user)
        .pipe(
          tap(() => {
            this.toastr.success(
              'Siker',
              'Sikeres regisztráció, átirányítva a főoldra'
            );
            this.signupForm.reset();
          })
        )
        .subscribe();
    }
  }

  createForm(): void {
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
    if (this.signupForm.get('postcode').valid) {
      const postcode = (event.target as HTMLInputElement).value;
      const headers = new HttpHeaders({
        'X-RapidAPI-Key': environment.zippopotamusApiKey,
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
          tap((response: PostCodeApiData) => {
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
