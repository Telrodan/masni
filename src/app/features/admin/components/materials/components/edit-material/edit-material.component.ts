import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { Observable, tap, filter } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';

import { Category } from '@core/models/category.model';
import { Material, RawMaterial } from '@core/models/material.model';
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
  editMaterialForm: FormGroup;

  imagePreview: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Material,
    private dialogRef: MatDialogRef<EditMaterialComponent>,
    private materialService: MaterialService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private store$: Store
  ) {
    this.editMaterialForm = this.fb.group({
      name: [this.data.name, Validators.required],
      categoryId: [this.data.category.id, Validators.required],
      image: [this.data.image, Validators.required],
      extraPrice: [this.data.extraPrice, Validators.required],
      isAvailable: [this.data.isAvailable, Validators.required]
    });

    this.imagePreview = this.data.image;
  }

  ngOnInit(): void {
    this.categories$ = this.store$.select(selectMaterialCategories).pipe(
      filter((categories) => !!categories),
      untilDestroyed(this)
    );
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

  onEditMaterial(): void {
    if (this.editMaterialForm.valid) {
      const material: RawMaterial = {
        name: this.editMaterialForm.value.name.trim(),
        categoryId: this.editMaterialForm.value.categoryId,
        image: this.editMaterialForm.value.image,
        extraPrice: this.editMaterialForm.value.extraPrice,
        isAvailable: this.editMaterialForm.value.isAvailable
      };

      if (material.name) {
        this.materialService
          .updateMaterial$(material, this.data.id)
          .pipe(
            tap((material) => {
              this.toastr.success(`${material.name} minta módosítva`);
              this.dialogRef.close();
            })
          )
          .subscribe();
      } else {
        this.toastr.info('Kérlek adj meg egy minta nevet');
      }
    } else {
      this.toastr.info('Kérlek töltsd ki az összes mezőt');
    }
  }
}
