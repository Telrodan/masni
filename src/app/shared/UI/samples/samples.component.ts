import { Component, OnInit } from '@angular/core';
import { Material } from 'src/app/core/models/material.model';
import { MaterialService } from 'src/app/core/services/material.service';

@Component({
  selector: 'masni-handmade-dolls-samples',
  templateUrl: './samples.component.html',
  styleUrls: ['./samples.component.scss']
})
export class SamplesComponent implements OnInit {
  private materials: Material[];
  public patternedCotton: Material[];
  public minkyPlus: Material[];
  public doubleGauze: Material[];

  displayCustom: boolean;
  activeIndex = 0;

  imageClick(index: number) {
    this.activeIndex = index;
    this.displayCustom = true;
  }

  constructor(private materialService: MaterialService) {}

  public ngOnInit(): void {
    this.materials = this.materialService.getMaterials();
    this.filterMaterials();
  }

  private filterMaterials() {
    this.patternedCotton = this.materials.filter(
      (material) => material.category === 'patternedCotton'
    );
    this.minkyPlus = this.materials.filter(
      (material) => material.category === 'minkyPlus'
    );
    this.doubleGauze = this.materials.filter(
      (material) => material.category === 'doubleGauze'
    );
  }
}
