import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Category } from '@core/models/category.model';
import { Inspiration } from '@core/models/inspiration.model';
import { Material } from '@core/models/material.model';
import { InspirationService } from '@core/services/inspiration.service';
import { ToastrService } from '@core/services/toastr.service';
import { selectInspirationCategories } from '@core/store';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';
import {
  addImageToFormAndSetPreview,
  removeImageFromFormAndInputAndClearPreview
} from '@shared/util/image-upload-helpers';
import { Observable, filter, tap } from 'rxjs';

@UntilDestroy()
@Component({
  selector: 'mhd-edit-inspiration',
  templateUrl: './edit-inspiration.component.html',
  styleUrls: ['./edit-inspiration.component.scss']
})
export class EditInspirationComponent implements OnInit {
  categories$: Observable<Category[]>;

  editInspirationForm = this.fb.group({
    name: [this.data.name, Validators.required],
    categoryId: [this.data?.categoryId, Validators.required],
    image: [this.data.image, Validators.required]
  });

  imagePreview: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Material,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EditInspirationComponent>,
    private store$: Store,
    private inspirationService: InspirationService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.categories$ = this.store$.select(selectInspirationCategories).pipe(
      filter((categories) => !!categories),
      untilDestroyed(this)
    );

    this.imagePreview = this.data.image;
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
      console.log('lel');
      const editedInspiration: Inspiration = {
        id: this.data.id,
        name: this.editInspirationForm.value.name.trim(),
        categoryId: this.editInspirationForm.value.categoryId,
        image: this.editInspirationForm.value.image
      };

      const formData = new FormData();

      formData.append('id', editedInspiration.id);
      formData.append('name', editedInspiration.name);
      formData.append('categoryId', editedInspiration.categoryId);
      formData.append('image', editedInspiration.image);

      if (editedInspiration.name) {
        this.inspirationService
          .updateInspiration$(formData)
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
    }
  }
}
