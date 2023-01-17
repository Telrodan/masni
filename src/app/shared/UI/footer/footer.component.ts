import { Component } from '@angular/core';

import {
  faLocationDot,
  faPhone,
  faEnvelope
} from '@fortawesome/free-solid-svg-icons';

import { faFacebook, faInstagram } from '@fortawesome/free-brands-svg-icons';

@Component({
  selector: 'masni-handmade-dolls-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  public faLocationDot = faLocationDot;
  public faPhone = faPhone;
  public faEnvelope = faEnvelope;
  public faFacebook = faFacebook;
  public faInstagram = faInstagram;
}
