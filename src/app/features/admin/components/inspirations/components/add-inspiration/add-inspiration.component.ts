import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

import { Observable, tap, filter } from 'rxjs';

import { InspirationService } from '@core/services/inspiration.service';
import { ToastrService } from '@core/services/toastr.service';
import { Category } from '@core/models/category.model';
import { Store } from '@ngrx/store';
import { selectInspirationCategories } from '@core/store';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import {
  addImageToFormAndSetPreview,
  removeImageFromFormAndInputAndClearPreview
} from '@shared/util/image-upload-helpers';

@UntilDestroy()
@Component({
  selector: 'mhd-add-inspiration',
  templateUrl: './add-inspiration.component.html',
  styleUrls: ['./add-inspiration.component.scss']
})
export class AddInspirationComponent implements OnInit {
  categories$: Observable<Category[]>;

  addInspirationForm = this.fb.group({
    name: ['', Validators.required],
    categoryId: ['', Validators.required],
    image: ['', Validators.required]
  });

  imagePreview: string;

  constructor(
    private dialogRef: MatDialogRef<AddInspirationComponent>,
    private inspirationService: InspirationService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private store$: Store
  ) {}

  ngOnInit(): void {
    this.categories$ = this.store$.select(selectInspirationCategories).pipe(
      filter((categories) => !!categories),
      untilDestroyed(this)
    );
  }

  async onImagePicked(event: Event): Promise<void> {
    this.imagePreview = await addImageToFormAndSetPreview(
      event,
      this.addInspirationForm
    );
  }

  onImageClear(imageInput: HTMLInputElement): void {
    this.imagePreview = removeImageFromFormAndInputAndClearPreview(
      this.addInspirationForm,
      imageInput
    );
  }

  onAddInspiration(): void {
    if (this.addInspirationForm.valid) {
      const inspirationData = new FormData();
      const inspirationName = this.addInspirationForm.value.name.trim();
      const inspirationCategoryId = this.addInspirationForm.value.categoryId;
      const inspirationImage = this.addInspirationForm.value.image;

      inspirationData.append('name', inspirationName);
      inspirationData.append('categoryId', inspirationCategoryId);
      inspirationData.append('image', inspirationImage);

      if (inspirationName) {
        this.inspirationService
          .addInspiration$(inspirationData)
          .pipe(
            tap(() => {
              this.toastr.success('Inspiráció hozzáadva');
              this.dialogRef.close();
            })
          )
          .subscribe();
      } else {
        this.toastr.error('Kérlek adj meg egy inspiráció nevet');
      }
    }
  }
}
