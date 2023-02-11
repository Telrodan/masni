import { Component, OnInit } from '@angular/core';
import { MaterialService } from 'src/app/core/services/material.service';

import { firstCarousel, secondCarousel, thirdCarousel } from './LANDING_DATA';

@Component({
  selector: 'masni-handmade-dolls-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {
  public firstCarousel = { ...firstCarousel };
  public secondCarousel = { ...secondCarousel };
  public thirdCarousel = { ...thirdCarousel };

  constructor(private materialService: MaterialService) {}

  public ngOnInit(): void {
    const materials = this.materialService.getMaterials();
    materials.forEach((material) => {
      if (material.image) {
        this.secondCarousel.images.push(
          '../../../assets/images/materials/' + material.image
        );
      }
    });
  }

  public scrollToTop() {
    document.querySelector('body').scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }
}
