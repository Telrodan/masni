import { Component } from '@angular/core';

import {
  faPhone,
  faInbox,
  faEnvelope
} from '@fortawesome/free-solid-svg-icons';
import { faFacebook } from '@fortawesome/free-brands-svg-icons';

@Component({
  selector: 'masni-handmade-dolls-landing-contact-us',
  templateUrl: './landing-contact-us.component.html',
  styleUrls: ['./landing-contact-us.component.scss']
})
export class LandingContactUsComponent {
  public faPhone = faPhone;
  public faFacebook = faFacebook;
  public faInbox = faInbox;
  public faEnvelope = faEnvelope;
}
