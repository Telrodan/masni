import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

import { tap } from 'rxjs';

import { RawCategory } from '@core/models/category.model';
import { CategoryType } from '@core/enums/category-type.enum';
import { CategoryService } from '@core/services/category.service';
import { ToastrService } from '@core/services/toastr.service';

import {
  addImageToFormAndSetPreview,
  removeImageFromFormAndInputAndClearPreview
} from '@shared/util/image-upload-helpers';

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
    image: ['', Validators.required],
    description: ['']
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
      const category: RawCategory = {
        type: this.addCategoryForm.value.type,
        name: this.addCategoryForm.value.name.trim(),
        image: this.addCategoryForm.value.image,
        description: this.addCategoryForm.value.description.trim()
      };

      if (category.name) {
        this.categoryService
          .addCategory$(category)
          .pipe(
            tap(() => {
              this.toastr.success(`${category.name} hozzáadva`);
              this.dialogRef.close();
            })
          )
          .subscribe();
      } else {
        this.toastr.info('Kérlek adj meg egy kategória nevet');
      }
    } else {
      this.toastr.info('Kérlek töltsd ki az összes mezőt');
    }
  }
}
