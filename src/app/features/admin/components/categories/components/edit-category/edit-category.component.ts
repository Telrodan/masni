import { Component, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { tap } from 'rxjs';

import { Category } from '@core/models/category.model';
import { CategoryService } from '@core/services/category.service';
import { ToastrService } from '@core/services/toastr.service';
import { capitalize } from 'src/app/shared/util/first-letter-capital';
import {
  addImageToFormAndSetPreview,
  removeImageFromFormAndInputAndClearPreview
} from '@shared/util/image-upload-helpers';

@Component({
  selector: 'mhd-edit-category',
  templateUrl: './edit-category.component.html',
  styleUrls: ['./edit-category.component.scss']
})
export class EditCategoryComponent {
  editCategoryForm = this.fb.group({
    name: [this.data.name, Validators.required],
    image: [this.data.image, Validators.required]
  });

  imagePreview = this.data.image;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Category,
    private dialogRef: MatDialogRef<EditCategoryComponent>,
    private categoryService: CategoryService,
    private toastr: ToastrService,
    private fb: FormBuilder
  ) {}

  async onImagePicked(event: Event): Promise<void> {
    this.imagePreview = await addImageToFormAndSetPreview(
      event,
      this.editCategoryForm
    );
  }

  onImageClear(imageInput: HTMLInputElement): void {
    this.imagePreview = removeImageFromFormAndInputAndClearPreview(
      this.editCategoryForm,
      imageInput
    );
  }

  onEditCategory(): void {
    if (this.editCategoryForm.valid) {
      const name = this.editCategoryForm.value.name.trim();
      if (name) {
        const categoryData = new FormData();

        categoryData.append('name', name);
        categoryData.append('image', this.editCategoryForm.value.image);

        this.categoryService
          .updateCategory$(categoryData, this.data.id)
          .pipe(
            tap(() => {
              this.toastr.success(`${capitalize(name)} kategória módosítva`);
              this.dialogRef.close();
            })
          )
          .subscribe();
      }
    }
  }
}
