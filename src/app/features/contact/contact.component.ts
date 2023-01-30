import { Component } from '@angular/core';

import {
  faPhone,
  faInbox,
  faEnvelope
} from '@fortawesome/free-solid-svg-icons';
import { faFacebook } from '@fortawesome/free-brands-svg-icons';

@Component({
  selector: 'masni-handmade-dolls-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent {
  public faPhone = faPhone;
  public faFacebook = faFacebook;
  public faInbox = faInbox;
  public faEnvelope = faEnvelope;
}
