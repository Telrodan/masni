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
  categories = categories;
  editMaterialForm: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Material,
    private dialogRef: MatDialogRef<EditMaterialComponent>,
    private materialService: MaterialService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.initEditMaterialForm(this.data);
  }

  onClose(): void {
    this.dialogRef.close();
  }

  onUpdateMaterial(): void {
    console.log(this.data.id);
    if (this.editMaterialForm.valid) {
      const updatedMaterial: Material = {
        ...this.data,
        ...this.editMaterialForm.value
      };

      this.materialService
        .updateMaterial$(updatedMaterial)
        .pipe(
          tap((material) => {
            this.toastr.success(`${material.name} módosítva`);
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
      extra: new FormControl(material.extra, Validators.required),
      isAvailable: new FormControl(material.isAvailable, Validators.required)
    });
  }
}
