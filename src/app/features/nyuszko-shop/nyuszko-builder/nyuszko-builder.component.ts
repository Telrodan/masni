import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

// import { Nyuszko } from '../product-profiles/nyuszko';

@Component({
  selector: 'masni-handmade-dolls-nyuszko-builder',
  templateUrl: './nyuszko-builder.component.html',
  styleUrls: ['./nyuszko-builder.component.scss']
})
export class NyuszkoBuilderComponent implements OnInit {
  public pickerForm: FormGroup;
  // public product = Nyuszko;

  public ngOnInit(): void {
    this.pickerForm = new FormGroup({
      alapszin: new FormControl(null, Validators.required),
      fulek: new FormControl(null, Validators.required),
      masni: new FormControl(null, Validators.required)
    });
  }
}
