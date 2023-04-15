import { Component } from '@angular/core';

@Component({
  selector: 'masni-handmade-dolls-landing-brands',
  templateUrl: './landing-brands.component.html',
  styleUrls: ['./landing-brands.component.scss']
})
export class LandingBrandsComponent {
  public onNavigate() {
    window.open(
      'https://www.facebook.com/profile.php?id=100087389177967',
      '_blank'
    );
  }
}
