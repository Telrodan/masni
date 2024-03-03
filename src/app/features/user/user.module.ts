import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { DividerModule } from 'primeng/divider';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

import { UserProfileComponent } from './user-profile/user-profile.component';
import { UserRoutingModule } from './user-routing.module';

const PRIME_NG = [
  DividerModule,
  RadioButtonModule,
  ButtonModule,
  InputTextModule
];

@NgModule({
  declarations: [UserProfileComponent],
  imports: [CommonModule, UserRoutingModule, ReactiveFormsModule, ...PRIME_NG]
})
export class UserModule {}
