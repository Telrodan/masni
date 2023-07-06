import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

import { tap } from 'rxjs';

import { CategoryService } from '@core/services/category.service';
import { ToastrService } from '@core/services/toastr.service';
import { capitalize } from 'src/app/shared/util/first-letter-capital';

@Component({
  selector: 'mhd-add-category',
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.scss']
})
export class AddCategoryComponent implements OnInit {
  addCategoryForm: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<AddCategoryComponent>,
    private categoryService: CategoryService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.initAddCategoryForm();
  }

  onAddCategory(): void {
    const name = this.addCategoryForm.value.name.trim();

    if (this.addCategoryForm.valid) {
      if (name) {
        this.categoryService
          .addCategory$(name)
          .pipe(
            tap(() => {
              this.toastr.success(`${capitalize(name)} kategória hozzáadva`);
              this.dialogRef.close();
            })
          )
          .subscribe();
      } else {
        this.toastr.info(`Kérlek adj meg egy kategória nevet`);
      }
    }
  }

  initAddCategoryForm(): void {
    this.addCategoryForm = new FormGroup({
      name: new FormControl('', Validators.required)
    });
  }
}
