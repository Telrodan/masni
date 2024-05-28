import { Component, OnInit } from '@angular/core';

import { Observable, filter, map } from 'rxjs';

import { Inspiration } from '@core/models/inspiration.model';
import { InspirationPageData } from '@core/models/inspiration-page-data.model';
import { Title, Meta } from '@angular/platform-browser';
// import { InspirationCategory } from '@core/models/category.model';

@Component({
    selector: 'mhd-inspiration-page',
    templateUrl: './inspiration-page.component.html',
    styleUrls: ['./inspiration-page.component.scss']
})
export class InspirationPageComponent implements OnInit {
    inspirationPageData$: Observable<InspirationPageData[]>;

    activeIndexArr: number[] = [];
    displayCustomGaleryArr: boolean[] = [];

    imageLoadedStatus: any = {};

    constructor(private titleService: Title, private metaService: Meta) {
        this.titleService.setTitle('Nyuszkó Kuckó | Inspirációk');
        this.metaService.addTags([
            {
                name: 'description',
                content:
                    'Inspirálódj a Nyuszkó Kuckó kézzel készített nyuszkóiból, mackóiból, szundikendőiből, babáiból és kiegészítőiből. Fedezze fel a legbájosabb és legkülönlegesebb kézzel készített nyuszkókat, mackókat, nyuszkó szundikendőket, mackó szundikendőket, babákat és kiegészítőket'
            },
            {
                name: 'keywords',
                content:
                    'inspiráció ,babák, nyuszi, nyuszik, nyuszkó, nyuszkók, maci, macik, mackók, szundikendő, szundikendők, kézzel készített, webshop'
            },
            {
                property: 'og:title',
                content: 'Nyuszkó Kuckó | Inspirációk'
            },
            {
                property: 'og:description',
                content:
                    'Inspirálódj a Nyuszkó Kuckó kézzel készített nyuszkóiból, mackóiból, szundikendőiből, babáiból és kiegészítőiből. Fedezze fel a legbájosabb és legkülönlegesebb kézzel készített nyuszkókat, mackókat, nyuszkó szundikendőket, mackó szundikendőket, babákat és kiegészítőket'
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
        // this.inspirationPageData$ = this.store$
        //   .select(selectInspirationCategories)
        //   .pipe(
        //     filter((categories) => categories.length > 0),
        //     map((categories) => {
        //       const pageData = [];
        //       categories.forEach((category) => {
        //         const data: InspirationPageData = {
        //           title: category.name,
        //           items: category.items
        //         };
        //         pageData.push(data);
        //       });
        //       return pageData;
        //     })
        //   );
    }

    imageClickGalery(index: number, galeryIndex: number): void {
        this.activeIndexArr[galeryIndex] = index;
        this.displayCustomGaleryArr[galeryIndex] = true;
    }

    imageLoaded(categoryTitle: string, index: number) {
        if (!this.imageLoadedStatus[categoryTitle]) {
            this.imageLoadedStatus[categoryTitle] = [];
        }

        this.imageLoadedStatus[categoryTitle][index] = true;
    }
}
