import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

import { tap } from 'rxjs';

import { CategoryService } from '@core/services/category.service';
import { ToastrService } from '@core/services/toastr.service';
import { capitalize } from 'src/app/shared/util/first-letter-capital';
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
  addCategoryForm = this.fb.group({
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
      const name = this.addCategoryForm.value.name.trim();
      if (name) {
        const categoryData = new FormData();

        categoryData.append('name', name);
        categoryData.append('image', this.addCategoryForm.value.image);

        this.categoryService
          .addCategory$(categoryData)
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
}
