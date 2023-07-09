import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Material } from '@core/models/material.model';
import { MaterialService } from '@core/services/material.service';
import { ToastrService } from '@core/services/toastr.service';
import { tap } from 'rxjs';
import { categories } from 'src/app/shared/util/material-categories';

@Component({
  selector: 'mhd-edit-material',
  templateUrl: './edit-material.component.html',
  styleUrls: ['./edit-material.component.scss']
})
export class EditMaterialComponent implements OnInit {
  editMaterialForm: FormGroup;
  imagePreview: string;
  categories = categories;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Material,
    private dialogRef: MatDialogRef<EditMaterialComponent>,
    private materialService: MaterialService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.initEditMaterialForm(this.data);
    this.imagePreview = this.data.image;
  }

  onImagePicked(event: Event): void {
    const file = (event.target as HTMLInputElement).files[0];

    this.editMaterialForm.patchValue({ image: file });
    this.editMaterialForm.get('image').updateValueAndValidity();

    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  onImageClear(): void {
    this.imagePreview = '';
    this.editMaterialForm.value.image = '';
    this.editMaterialForm.patchValue({ image: '' });
    this.editMaterialForm.get('image').updateValueAndValidity();
  }

  onUpdateMaterial(): void {
    if (this.editMaterialForm.valid) {
      const editedMaterial = new FormData();
      editedMaterial.append('name', this.editMaterialForm.value.name);
      editedMaterial.append('category', this.editMaterialForm.value.category);
      editedMaterial.append('image', this.editMaterialForm.value.image);
      editedMaterial.append('extra', this.editMaterialForm.value.extra);
      editedMaterial.append(
        'isAvailable',
        this.editMaterialForm.value.isAvailable
      );

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

  initEditMaterialForm(material: Material): void {
    this.editMaterialForm = new FormGroup({
      name: new FormControl(material.name, Validators.required),
      category: new FormControl(material.category, Validators.required),
      image: new FormControl(material.image, Validators.required),
      extra: new FormControl(material.extra, Validators.required),
      isAvailable: new FormControl(material.isAvailable, Validators.required)
    });
  }
}
