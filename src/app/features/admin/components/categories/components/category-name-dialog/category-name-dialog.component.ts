import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { tap } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { Category } from '@core/models/category.model';
import { CategoryService } from '@core/services/category.service';
import { ToastrService } from '@core/services/toastr.service';

@Component({
  selector: 'masni-handmade-dolls-category-name-dialog',
  templateUrl: './category-name-dialog.component.html',
  styleUrls: ['./category-name-dialog.component.scss']
})
export class CategoryNameDialogComponent implements OnInit {
  categoryForm: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Category,
    private dialogRef: MatDialogRef<CategoryNameDialogComponent>,
    private categoryService: CategoryService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.categoryForm = new FormGroup({
      categoryName: new FormControl(this.data.categoryName, Validators.required)
    });
  }

  onClose(): void {
    this.dialogRef.close();
  }

  onAction(): void {
    if (this.categoryForm.valid) {
      const category: Category = {
        ...this.data,
        ...this.categoryForm.value
      };
      this.categoryService
        .updateCategory$(category)
        .pipe(
          tap(() => {
            this.toastr.success('Siker', `${category.categoryName} módosítva`);
            this.dialogRef.close();
          })
        )
        .subscribe();
    }
  }
}
