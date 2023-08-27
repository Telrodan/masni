import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

import { Observable, tap } from 'rxjs';

import { MaterialService } from '@core/services/material.service';
import { ToastrService } from '@core/services/toastr.service';
import { Category } from '@core/models/category.model';
import { Store } from '@ngrx/store';
import { selectMaterialCategories } from '@core/store';
import {
  addImageToFormAndSetPreview,
  removeImageFromFormAndInputAndClearPreview
} from '@shared/util/image-upload-helpers';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'mhd-add-material',
  templateUrl: './add-material.component.html',
  styleUrls: ['./add-material.component.scss']
})
export class AddMaterialComponent implements OnInit {
  categories$: Observable<Category[]>;

  addMaterialForm = this.fb.group({
    name: ['', Validators.required],
    categoryId: ['', Validators.required],
    image: ['', Validators.required],
    extra: [0, Validators.required],
    isAvailable: [true, Validators.required]
  });

  imagePreview: string;

  constructor(
    private store$: Store,
    private materialService: MaterialService,
    private toastr: ToastrService,
    private dialogRef: MatDialogRef<AddMaterialComponent>,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.categories$ = this.store$
      .select(selectMaterialCategories)
      .pipe(untilDestroyed(this));
  }

  async onImagePicked(event: Event): Promise<void> {
    this.imagePreview = await addImageToFormAndSetPreview(
      event,
      this.addMaterialForm
    );
  }

  onImageClear(imageInput: HTMLInputElement): void {
    this.imagePreview = removeImageFromFormAndInputAndClearPreview(
      this.addMaterialForm,
      imageInput
    );
  }

  onAddMaterial(): void {
    if (this.addMaterialForm.valid) {
      const material = new FormData();
      const materialName = this.addMaterialForm.value.name.trim();
      const materialCategoryId = this.addMaterialForm.value.categoryId;
      const materialImage = this.addMaterialForm.value.image;
      const materialExtra = this.addMaterialForm.value.extra.toString();
      const materialIsAvailable =
        this.addMaterialForm.value.isAvailable.toString();

      if (materialName) {
        material.append('name', materialName);
        material.append('categoryId', materialCategoryId);
        material.append('image', materialImage);
        material.append('extra', materialExtra);
        material.append('isAvailable', materialIsAvailable);
        this.materialService
          .addMaterial$(material)
          .pipe(
            tap(() => {
              this.toastr.success(
                `${this.addMaterialForm.value.name} hozzáadva`
              );
              this.dialogRef.close();
            })
          )
          .subscribe();
      } else {
        this.toastr.error('Kérlek adj meg egy minta nevet');
      }
    }
  }
}
