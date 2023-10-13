import { Component } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'mhd-contact-page',
  templateUrl: './contact-page.component.html',
  styleUrls: ['./contact-page.component.scss']
})
export class ContactPageComponent {
  constructor(private titleService: Title, private metaService: Meta) {
    this.titleService.setTitle('Nyuszkó Kuckó | Kapcsolat');
    this.metaService.addTags([
      {
        name: 'description',
        content:
          'Lépj kapcsolatba velem, ha kérdésed van, vagy szeretnél rendelni valamit. Fedezze fel a legbájosabb és legkülönlegesebb kézzel készített nyuszkókat, mackókat, nyuszkó szundikendőket, mackó szundikendőket, babákat és kiegészítőket'
      },
      {
        name: 'keywords',
        content:
          'kapcsolat ,babák, nyuszi, nyuszik, nyuszkó, nyuszkók, maci, macik, mackók, szundikendő, szundikendők, kézzel készített, webshop'
      },
      {
        property: 'og:title',
        content: 'Nyuszkó Kuckó | Kapcsolat'
      },
      {
        property: 'og:description',
        content:
          'Lépj kapcsolatba velem, ha kérdésed van, vagy szeretnél rendelni valamit. Fedezze fel a legbájosabb és legkülönlegesebb kézzel készített nyuszkókat, mackókat, nyuszkó szundikendőket, mackó szundikendőket, babákat és kiegészítőket'
      },
      {
        property: 'og:image',
        content: 'https://nyuszkokucko.hu/assets/images/nyuszko-kucko-logo.png'
      },
      { name: 'robots', content: 'index, follow' },
      { name: 'author', content: 'Nyuszkó Kuckó' }
    ]);
  }
}
