import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

import { tap } from 'rxjs';

import { MaterialService } from '@core/services/material.service';
import { ToastrService } from '@core/services/toastr.service';
import { categories } from 'src/app/shared/util/material-categories';

@Component({
  selector: 'mhd-add-material',
  templateUrl: './add-material.component.html',
  styleUrls: ['./add-material.component.scss']
})
export class AddMaterialComponent implements OnInit {
  addMaterialForm: FormGroup;
  imagePreview: string;
  categories = categories;

  constructor(
    private materialService: MaterialService,
    private toastr: ToastrService,
    private dialogRef: MatDialogRef<AddMaterialComponent>
  ) {}

  ngOnInit(): void {
    this.initAddMaterialForm();
  }

  onImagePicked(event: Event): void {
    const file = (event.target as HTMLInputElement).files[0];

    this.addMaterialForm.patchValue({ image: file });
    this.addMaterialForm.get('image').updateValueAndValidity();

    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  onImageClear(): void {
    this.imagePreview = '';
    this.addMaterialForm.value.image = '';
    this.addMaterialForm.patchValue({ image: '' });
    this.addMaterialForm.get('image').updateValueAndValidity();
  }

  onAddMaterial(): void {
    if (this.addMaterialForm.valid) {
      const material = new FormData();
      material.append('name', this.addMaterialForm.value.name);
      material.append('category', this.addMaterialForm.value.category);
      material.append('image', this.addMaterialForm.value.image);
      material.append('extra', this.addMaterialForm.value.extra);
      material.append('isAvailable', this.addMaterialForm.value.isAvailable);

      this.materialService
        .addMaterial$(material)
        .pipe(
          tap(() => {
            this.toastr.success(`${this.addMaterialForm.value.name} hozzáadva`);
            this.dialogRef.close();
          })
        )
        .subscribe();
    }
  }

  onClose(): void {
    this.dialogRef.close();
  }

  initAddMaterialForm(): void {
    this.addMaterialForm = new FormGroup({
      name: new FormControl(null, Validators.required),
      category: new FormControl(null, Validators.required),
      image: new FormControl(null, Validators.required),
      extra: new FormControl(null, Validators.required),
      isAvailable: new FormControl(true, Validators.required)
    });
  }
}
