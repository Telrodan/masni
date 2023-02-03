import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { AdminSignupComponent } from './admin-signup/admin-signup.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ReactiveFormsModule } from '@angular/forms';

const PRIME_NG = [ButtonModule, InputTextModule];

@NgModule({
  declarations: [
    AdminLoginComponent,
    AdminSignupComponent,
    AdminDashboardComponent
  ],
  imports: [CommonModule, ReactiveFormsModule, AdminRoutingModule, ...PRIME_NG]
})
export class AdminModule {}
