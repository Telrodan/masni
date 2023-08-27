import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { Observable, tap, filter } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';

import { Category } from '@core/models/category.model';
import { Material } from '@core/models/material.model';
import { MaterialService } from '@core/services/material.service';
import { ToastrService } from '@core/services/toastr.service';
import { selectMaterialCategories } from '@core/store';
import {
  addImageToFormAndSetPreview,
  removeImageFromFormAndInputAndClearPreview
} from '@shared/util/image-upload-helpers';

@UntilDestroy()
@Component({
  selector: 'mhd-edit-material',
  templateUrl: './edit-material.component.html',
  styleUrls: ['./edit-material.component.scss']
})
export class EditMaterialComponent implements OnInit {
  categories$: Observable<Category[]>;

  editMaterialForm = this.fb.group({
    name: [this.data.name, Validators.required],
    categoryId: [this.data?.categoryId, Validators.required],
    image: [this.data.image, Validators.required],
    extra: [this.data.extra, Validators.required],
    isAvailable: [this.data.isAvailable, Validators.required]
  });

  imagePreview: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Material,
    private dialogRef: MatDialogRef<EditMaterialComponent>,
    private materialService: MaterialService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private store$: Store
  ) {}

  ngOnInit(): void {
    this.categories$ = this.store$.select(selectMaterialCategories).pipe(
      filter((categories) => !!categories),
      untilDestroyed(this)
    );

    this.imagePreview = this.data.image;
  }

  async onImagePicked(event: Event): Promise<void> {
    this.imagePreview = await addImageToFormAndSetPreview(
      event,
      this.editMaterialForm
    );
  }

  onImageClear(imageInput: HTMLInputElement): void {
    this.imagePreview = removeImageFromFormAndInputAndClearPreview(
      this.editMaterialForm,
      imageInput
    );
  }

  onUpdateMaterial(): void {
    if (this.editMaterialForm.valid) {
      const editedMaterial = new FormData();
      const materialName = this.editMaterialForm.value.name.trim();
      const materialCategoryId = this.editMaterialForm.value.categoryId;
      const materialImage = this.editMaterialForm.value.image;
      const materialExtra = this.editMaterialForm.value.extra.toString();
      const materialIsAvailable =
        this.editMaterialForm.value.isAvailable.toString();

      editedMaterial.append('name', materialName);
      editedMaterial.append('categoryId', materialCategoryId);
      editedMaterial.append('image', materialImage);
      editedMaterial.append('extra', materialExtra);
      editedMaterial.append('isAvailable', materialIsAvailable);

      this.materialService
        .updateMaterial$(editedMaterial, this.data.id)
        .pipe(
          tap((material) => {
            this.toastr.success(`${material.name} minta módosítva`);
            this.dialogRef.close();
          })
        )
        .subscribe();
    }
  }
}
