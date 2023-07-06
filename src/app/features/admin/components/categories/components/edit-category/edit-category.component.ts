import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { tap } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { Category } from '@core/models/category.model';
import { CategoryService } from '@core/services/category.service';
import { ToastrService } from '@core/services/toastr.service';
import { capitalize } from 'src/app/shared/util/first-letter-capital';

@Component({
  selector: 'mhd-edit-category',
  templateUrl: './edit-category.component.html',
  styleUrls: ['./edit-category.component.scss']
})
export class EditCategoryComponent implements OnInit {
  editCategoryForm: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Category,
    private dialogRef: MatDialogRef<EditCategoryComponent>,
    private categoryService: CategoryService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.initEditCategoryForm();
  }

  onEditCategory(): void {
    if (this.editCategoryForm.valid) {
      const category: Category = {
        ...this.data,
        ...this.editCategoryForm.value
      };
      this.categoryService
        .updateCategory$(category)
        .pipe(
          tap(() => {
            this.toastr.success(
              `${capitalize(category.name)} kategória módosítva`
            );
            this.dialogRef.close();
          })
        )
        .subscribe();
    }
  }

  onClose(): void {
    this.dialogRef.close();
  }

  initEditCategoryForm(): void {
    this.editCategoryForm = new FormGroup({
      name: new FormControl(this.data.name, Validators.required)
    });
  }
}
