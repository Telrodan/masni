import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'masni-handmade-dolls-signup',
  templateUrl: './admin-signup.component.html',
  styleUrls: ['./admin-signup.component.scss']
})
export class AdminSignupComponent implements OnInit {
  public registerForm: FormGroup;

  constructor(private authService: AuthService) {}

  public ngOnInit(): void {
    this.registerForm = new FormGroup({
      email: new FormControl(null, Validators.required),
      password: new FormControl(null, Validators.required)
    });
  }

  public register(): void {
    if (this.registerForm.valid) {
      this.authService
        .createUser(
          this.registerForm.value.email,
          this.registerForm.value.password
        )
        .subscribe((result) => {
          console.log(result);
        });
    }
  }
}
