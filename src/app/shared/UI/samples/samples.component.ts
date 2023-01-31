import { Component } from '@angular/core';

import {
  egyszinuPamutvaszon,
  mintasPamutvaszon,
  egyszinuLenvaszon,
  minkyPluss,
  duplagez,
  gyapjufilc
} from 'src/app/features/MATERIALS_DATA';

@Component({
  selector: 'masni-handmade-dolls-samples',
  templateUrl: './samples.component.html',
  styleUrls: ['./samples.component.scss']
})
export class SamplesComponent {
  public egyszinuPamutvaszon = egyszinuPamutvaszon;
  public mintasPamutvaszon = mintasPamutvaszon;
  public egyszinuLenvaszon = egyszinuLenvaszon;
  public minkyPluss = minkyPluss;
  public duplagez = duplagez;
  public gyapjufilc = gyapjufilc;
}
