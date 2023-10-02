import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

import { Store } from '@ngrx/store';
import { Observable, tap } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { MaterialService } from '@core/services/material.service';
import { ToastrService } from '@core/services/toastr.service';
import { Category } from '@core/models/category.model';
import { RawMaterial } from '@core/models/material.model';
import { selectMaterialCategories } from '@core/store';
import {
  addImageToFormAndSetPreview,
  removeImageFromFormAndInputAndClearPreview
} from '@shared/util/image-upload-helpers';

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
    category: ['', Validators.required],
    image: ['', Validators.required],
    extraPrice: [0, Validators.required],
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
      const material: RawMaterial = {
        name: this.addMaterialForm.value.name.trim(),
        categoryId: this.addMaterialForm.value.category,
        image: this.addMaterialForm.value.image,
        extraPrice: this.addMaterialForm.value.extraPrice,
        isAvailable: this.addMaterialForm.value.isAvailable
      };

      if (material.name) {
        this.materialService
          .addMaterial$(material)
          .pipe(
            tap(() => {
              this.toastr.success(`${material.name} hozzáadva`);
              this.dialogRef.close();
            })
          )
          .subscribe();
      } else {
        this.toastr.error('Kérlek adj meg egy minta nevet');
      }
    } else {
      this.toastr.error('Kérlek töltsd ki az összes mezőt');
    }
  }
}
