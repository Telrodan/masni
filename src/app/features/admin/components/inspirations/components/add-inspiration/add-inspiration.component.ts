import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { InspirationService } from '@core/services/inspiration.service';
import { ToastrService } from '@core/services/toastr.service';
import { tap } from 'rxjs';

@Component({
  selector: 'mhd-add-inspiration',
  templateUrl: './add-inspiration.component.html',
  styleUrls: ['./add-inspiration.component.scss']
})
export class AddInspirationComponent implements OnInit {
  addInspirationForm: FormGroup;
  imagePreview: string;

  constructor(
    private dialogRef: MatDialogRef<AddInspirationComponent>,
    private inspirationService: InspirationService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.initAddInspirationForm();
  }

  onImagePicked(event: Event): void {
    const file = (event.target as HTMLInputElement).files[0];

    this.addInspirationForm.patchValue({ image: file });
    this.addInspirationForm.get('image').updateValueAndValidity();

    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  onImageClear(): void {
    this.imagePreview = '';
    this.addInspirationForm.patchValue({ image: '' });
    this.addInspirationForm.get('image').updateValueAndValidity();
  }

  onAddInspiration(): void {
    if (this.addInspirationForm.valid) {
      const inspirationData = new FormData();
      inspirationData.append(
        'image',
        this.addInspirationForm.get('image').value
      );
      this.inspirationService
        .addInspiration$(inspirationData)
        .pipe(
          tap(() => {
            this.toastr.success('Inspiráció hozzáadva');
            this.dialogRef.close();
          })
        )
        .subscribe();
    }
  }

  onClose(): void {
    this.dialogRef.close();
  }

  initAddInspirationForm(): void {
    this.addInspirationForm = new FormGroup({
      image: new FormControl(null, Validators.required)
    });
  }
}
