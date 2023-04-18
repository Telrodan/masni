import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { InspirationService } from '@core/services/inspiration.service';
import { ToastrService } from '@core/services/toastr.service';
import { tap } from 'rxjs';

@Component({
  selector: 'masni-handmade-dolls',
  templateUrl: './add-inspiration.component.html',
  styleUrls: ['./add-inspiration.component.scss']
})
export class AddInspirationComponent implements OnInit {
  inspirationForm: FormGroup;
  imagePreview: string;

  constructor(
    private inspirationService: InspirationService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  onSubmit(): void {
    if (this.inspirationForm.valid) {
      const inspirationData = new FormData();
      inspirationData.append('image', this.inspirationForm.get('image').value);
      this.inspirationService
        .addInspiration$(inspirationData)
        .pipe(
          tap(() => {
            this.toastr.success('Siker', 'Inspiráció hozzáadva');
            this.imagePreview = '';
            this.inspirationForm.reset();
          })
        )
        .subscribe();
    }
  }

  onImagePicked(event: Event): void {
    const file = (event.target as HTMLInputElement).files[0];
    this.inspirationForm.patchValue({ image: file });
    this.inspirationForm.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  initForm(): void {
    this.inspirationForm = new FormGroup({
      image: new FormControl(null, Validators.required)
    });
  }
}
