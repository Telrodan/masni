import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { Store } from '@ngrx/store';
import { Observable, filter, tap } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { Category } from '@core/models/category.model';
import { RawInspiration } from '@core/models/inspiration.model';
import { Material } from '@core/models/material.model';
import { ToastrService } from '@core/services/toastr.service';
import { InspirationService } from '@core/services/inspiration.service';
import { selectInspirationCategories } from '@core/store';
import {
  addImageToFormAndSetPreview,
  removeImageFromFormAndInputAndClearPreview
} from '@shared/util/image-upload-helpers';

@UntilDestroy()
@Component({
  selector: 'mhd-edit-inspiration',
  templateUrl: './edit-inspiration.component.html',
  styleUrls: ['./edit-inspiration.component.scss']
})
export class EditInspirationComponent implements OnInit {
  categories$: Observable<Category[]>;

  editInspirationForm: FormGroup;

  imagePreview: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Material,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EditInspirationComponent>,
    private store$: Store,
    private inspirationService: InspirationService,
    private toastr: ToastrService
  ) {
    this.editInspirationForm = this.fb.group({
      name: [this.data.name, Validators.required],
      categoryId: [this.data.category.id, Validators.required],
      image: [this.data.image, Validators.required]
    });

    this.imagePreview = this.data.image;
  }

  ngOnInit(): void {
    this.categories$ = this.store$.select(selectInspirationCategories).pipe(
      filter((categories) => !!categories),
      untilDestroyed(this)
    );
  }

  async onImagePicked(event: Event): Promise<void> {
    this.imagePreview = await addImageToFormAndSetPreview(
      event,
      this.editInspirationForm
    );
  }

  onImageClear(imageInput: HTMLInputElement): void {
    this.imagePreview = removeImageFromFormAndInputAndClearPreview(
      this.editInspirationForm,
      imageInput
    );
  }

  onEditInspiration(): void {
    if (this.editInspirationForm.valid) {
      const inspiration: RawInspiration = {
        name: this.editInspirationForm.value.name.trim(),
        categoryId: this.editInspirationForm.value.categoryId,
        image: this.editInspirationForm.value.image
      };

      if (inspiration.name) {
        this.inspirationService
          .updateInspiration$(inspiration, this.data.id)
          .pipe(
            tap((inspiration) => {
              this.toastr.success(`${inspiration.name} inspiráció módosítva`);
              this.dialogRef.close();
            })
          )
          .subscribe();
      } else {
        this.toastr.error('Kérlek add meg az inspiráció nevét');
      }
    } else {
      this.toastr.error('Kérlek töltsd ki az összes mezőt');
    }
  }
}
