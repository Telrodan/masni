import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

import { selectInspirationCategories } from '@core/store';
import { Observable, tap, filter } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { InspirationService } from '@core/services/inspiration.service';
import { ToastrService } from '@core/services/toastr.service';
import { Category } from '@core/models/category.model';
import { Store } from '@ngrx/store';
import {
  addImageToFormAndSetPreview,
  removeImageFromFormAndInputAndClearPreview
} from '@shared/util/image-upload-helpers';
import { RawInspiration } from '@core/models/inspiration.model';

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
      const inspiration: RawInspiration = {
        name: this.addInspirationForm.value.name.trim(),
        categoryId: this.addInspirationForm.value.categoryId,
        image: this.addInspirationForm.value.image
      };

      if (inspiration.name) {
        this.inspirationService
          .addInspiration$(inspiration)
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
    } else {
      this.toastr.error('Kérlek töltsd ki az összes mezőt');
    }
  }
}
