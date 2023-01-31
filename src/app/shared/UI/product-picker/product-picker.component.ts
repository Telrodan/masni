import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { Macko } from '../../../features/nyuszko-shop/product-profiles/macko';

@Component({
  selector: 'masni-handmade-dolls-product-picker',
  templateUrl: './product-picker.component.html',
  styleUrls: ['./product-picker.component.scss']
})
export class ProductPickerComponent implements OnInit {
  public pickerForm: FormGroup;
  public product = Macko;
  public hoveredImageUrl: string;

  public ngOnInit(): void {
    this.pickerForm = new FormGroup({
      alapszin: new FormControl(null, Validators.required),
      fulek: new FormControl(null, Validators.required)
    });
  }
}
