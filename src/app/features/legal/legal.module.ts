import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LegalRoutingModule } from './legal-routing.module';
import { PrivacyPolicyComponent } from './components/privacy-policy/privacy-policy.component';
import { TermsAndConditionsComponent } from './components/terms-and-conditions/terms-and-conditions.component';

@NgModule({
  declarations: [PrivacyPolicyComponent, TermsAndConditionsComponent],
  imports: [CommonModule, LegalRoutingModule]
})
export class LegalModule {}
