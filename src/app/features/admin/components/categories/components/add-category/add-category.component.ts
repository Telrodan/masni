import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

import { tap } from 'rxjs';

import { CategoryService } from '@core/services/category.service';
import { ToastrService } from '@core/services/toastr.service';
import {
  addImageToFormAndSetPreview,
  removeImageFromFormAndInputAndClearPreview
} from '@shared/util/image-upload-helpers';
import { CategoryType } from '@core/enums/category-type.enum';

@Component({
  selector: 'mhd-add-category',
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.scss']
})
export class AddCategoryComponent {
  readonly CategoryType = CategoryType;

  addCategoryForm = this.fb.group({
    type: [CategoryType.PRODUCT_CATEGORY, Validators.required],
    name: ['', Validators.required],
    image: ['', Validators.required]
  });

  imagePreview: string;

  constructor(
    private dialogRef: MatDialogRef<AddCategoryComponent>,
    private categoryService: CategoryService,
    private toastr: ToastrService,
    private fb: FormBuilder
  ) {}

  async onImagePicked(event: Event): Promise<void> {
    this.imagePreview = await addImageToFormAndSetPreview(
      event,
      this.addCategoryForm
    );
  }

  onImageClear(imageInput: HTMLInputElement): void {
    this.imagePreview = removeImageFromFormAndInputAndClearPreview(
      this.addCategoryForm,
      imageInput
    );
  }

  onAddCategory(): void {
    if (this.addCategoryForm.valid) {
      const categoryType = this.addCategoryForm.value.type;
      const categoryName = this.addCategoryForm.value.name.trim();
      const categoryImage = this.addCategoryForm.value.image;

      if (categoryName) {
        const categoryData = new FormData();
        categoryData.append('type', categoryType);
        categoryData.append('name', categoryName);
        categoryData.append('image', categoryImage);

        this.categoryService
          .addCategory$(categoryData)
          .pipe(
            tap(() => {
              this.toastr.success(`${categoryName} kategória hozzáadva`);
              this.dialogRef.close();
            })
          )
          .subscribe();
      } else {
        this.toastr.info(`Kérlek adj meg egy kategória nevet`);
      }
    }
  }
}
