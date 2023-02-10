import { Component, OnInit } from '@angular/core';
import { MaterialService } from 'src/app/core/services/material.service';

import { carouselImages } from './LANDING_DATA';

@Component({
  selector: 'masni-handmade-dolls-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {
  public carouselImages = carouselImages;
  public materialImages: string[] = [];

  constructor(private materialService: MaterialService) {}

  public ngOnInit(): void {
    this.materialService.getMaterials().forEach((material) => {
      if (material.image) {
        this.materialImages.push(
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
