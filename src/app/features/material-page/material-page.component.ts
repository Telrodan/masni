import { Component, OnInit } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';

import { filter, map, Observable } from 'rxjs';

import { Material } from '@core/models/material.model';
import { MaterialPageData } from '@core/models/material-page-data.model';

@Component({
    selector: 'mhd-material-page',
    templateUrl: './material-page.component.html',
    styleUrls: ['./material-page.component.scss']
})
export class MaterialPageComponent implements OnInit {
    materialPageData$: Observable<MaterialPageData[]>;

    activeIndexArr: number[] = [];
    displayCustomGaleryArr: boolean[] = [];

    imageLoadedStatus: any = {};

    constructor(private titleService: Title, private metaService: Meta) {
        this.titleService.setTitle('Nyuszkó Kuckó | Minták');
        this.metaService.addTags([
            {
                name: 'description',
                content:
                    'Fedezd fel alapanyagiam mintáit, amelyeket használok a Nyuszkó Kuckó kézzel készített nyuszkóihoz, mackóihoz, szundikendőihez, babáihoz és kiegészítőihez. Fedezze fel a legbájosabb és legkülönlegesebb kézzel készített nyuszkókat, mackókat, nyuszkó szundikendőket, mackó szundikendőket, babákat és kiegészítőket'
            },
            {
                name: 'keywords',
                content:
                    'kapcsolat ,babák, nyuszi, nyuszik, nyuszkó, nyuszkók, maci, macik, mackók, szundikendő, szundikendők, kézzel készített, webshop'
            },
            {
                property: 'og:title',
                content: 'Nyuszkó Kuckó | Minták'
            },
            {
                property: 'og:description',
                content:
                    'Fedezd fel alapanyagiam mintáit, amelyeket használok a Nyuszkó Kuckó kézzel készített nyuszkóihoz, mackóihoz, szundikendőihez, babáihoz és kiegészítőihez. Fedezze fel a legbájosabb és legkülönlegesebb kézzel készített nyuszkókat, mackókat, nyuszkó szundikendőket, mackó szundikendőket, babákat és kiegészítőket'
            },
            {
                property: 'og:image',
                content:
                    'https://nyuszkokucko.hu/assets/images/nyuszko-kucko-logo.png'
            },
            { name: 'robots', content: 'index, follow' },
            { name: 'author', content: 'Nyuszkó Kuckó' }
        ]);
    }

    ngOnInit(): void {
        // this.materialPageData$ = this.store$.select(selectMaterialCategories).pipe(
        //   filter((categories) => categories.length > 0),
        //   map((categories) => {
        //     const pageData = [];
        //     categories.forEach((category) => {
        //       const data: MaterialPageData = {
        //         title: category.name,
        //         items: category.items
        //       };
        //       pageData.push(data);
        //     });
        //     return pageData;
        //   })
        // );
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
