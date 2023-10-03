import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { tap } from 'rxjs';

import { Category, RawCategory } from '@core/models/category.model';
import { CategoryType } from '@core/enums/category-type.enum';
import { CategoryService } from '@core/services/category.service';
import { ToastrService } from '@core/services/toastr.service';

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
  readonly CategoryType = CategoryType;

  editCategoryForm: FormGroup;
  imagePreview: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Category,
    private dialogRef: MatDialogRef<EditCategoryComponent>,
    private categoryService: CategoryService,
    private toastr: ToastrService,
    private fb: FormBuilder
  ) {
    this.editCategoryForm = this.fb.group({
      name: [this.data.name, Validators.required],
      image: [this.data.image, Validators.required],
      description: [this.data.description]
    });

    this.imagePreview = this.data.image;
  }

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
      const category: RawCategory = {
        type: this.data.type,
        name: this.editCategoryForm.value.name.trim(),
        image: this.editCategoryForm.value.image,
        description: this.editCategoryForm.value.description.trim()
      };

      if (category.name) {
        this.categoryService
          .updateCategory$(category, this.data.id)
          .pipe(
            tap(() => {
              this.toastr.success(`${category.name} módosítva`);
              this.dialogRef.close();
            })
          )
          .subscribe();
      } else {
        this.toastr.info('Kérlek adj meg egy kategória nevet');
      }
    } else {
      this.toastr.info('Kérlek töltsd az összes mezőt');
    }
  }
}
