import { Component } from '@angular/core';

@Component({
  selector: 'mhd-brands-menu',
  templateUrl: './brands-menu.component.html',
  styleUrls: ['./brands-menu.component.scss']
})
export class BrandsMenuComponent {
  readonly redirectLink =
    'https://www.facebook.com/profile.php?id=100087389177967';

  onNavigate(): void {
    window.open(this.redirectLink, '_blank');
  }
}
