import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { selectAllMaterials } from '@core/store';
import { selectAllInspiration } from '@core/store/selectors/inspiration.selectors';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';
import { Observable, map } from 'rxjs';
import { CarouselData } from 'src/app/shared/components/carousel-with-heading-and-button/carousel-with-heading-and-button.component';

const inspirationCarouselData: CarouselData = {
  heading: 'Inspirációk',
  displayHeading: true,
  images: [],
  isRoundImage: false,
  linkText: 'Mindet megnézem',
  linkRoute: '/inspiration',
  displayLink: true
};

const materialCarouselData: CarouselData = {
  heading: 'Minták',
  displayHeading: true,
  images: [],
  isRoundImage: false,
  linkText: 'Mindet Megnézem',
  linkRoute: '/samples',
  displayLink: true
};

@UntilDestroy()
@Component({
  selector: 'mhd-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent implements OnInit {
  inspirationCarouselData$: Observable<CarouselData>;
  materialCarouselData$: Observable<CarouselData>;

  constructor(
    private store$: Store,
    private titleService: Title,
    private metaService: Meta
  ) {
    this.titleService.setTitle('Nyuszkó Kuckó | Főoldal');
    this.metaService.addTags([
      {
        name: 'description',
        content:
          'Szeretném nektek bemutatni a Nyuszkó Kuckót, ahol kész és egyedi, akár kézzel hímzett névvel ellátott textil figurákat, pihe-puha szundikendőket találtok. Nagyon sok minta és szín közül válogathattok, hogy minden egyéniség megtalálja a hozzá leginkább illőt. Minden darab szeretettel és hatalmas odafigyeléssel készül. Termékeimet egészen újszülött kortól ajánlom, babák számára is teljesen biztonságos. Egy nyuszkó egészen óvodás korig hű társ lehet. A pihe-puha szundikendők pedig segítenek az elalvásban, csupa öröm hozzájuk bújni. Kiváló ajándék lehet babaváró bulira, keresztelőre, de újszülött fotózásokra is remek kellék lehet.'
      },
      {
        name: 'keywords',
        content:
          'babák, nyuszi, nyuszik, nyuszkó, nyuszkók, maci, macik, mackók, szundikendő, szundikendők, kézzel készített, webshop'
      },
      {
        property: 'og:title',
        content: 'Nyuszkó Kuckó | Főoldal'
      },
      {
        property: 'og:description',
        content:
          'Fedezze fel a legbájosabb és legkülönlegesebb kézzel készített nyuszkókat, mackókat, nyuszkó szundikendőket, mackó szundikendőket, babákat és kiegészítőket.'
      },
      {
        property: 'og:image',
        content: 'https://nyuszkokucko.hu/assets/images/nyuszko-kucko-logo.png'
      },
      { name: 'robots', content: 'index, follow' },
      { name: 'author', content: 'Nyuszkó Kuckó' }
    ]);
  }

  ngOnInit(): void {
    this.inspirationCarouselData$ = this.store$
      .select(selectAllInspiration)
      .pipe(
        map((inspirations) => ({
          ...inspirationCarouselData,
          images: inspirations.map((inspiration) => inspiration.image)
        })),
        untilDestroyed(this)
      );

    this.materialCarouselData$ = this.store$.select(selectAllMaterials).pipe(
      map((materials) => ({
        ...materialCarouselData,
        images: materials.map((material) => material.image)
      }))
    );
  }
}
