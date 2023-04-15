import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MaterialService } from '@core/services/material.service';
import { ToastrService } from '@core/services/toastr.service';
import { tap } from 'rxjs';

@Component({
  selector: 'masni-handmade-dolls-add-material',
  templateUrl: './add-material.component.html',
  styleUrls: ['./add-material.component.scss']
})
export class AddMaterialComponent implements OnInit {
  materialForm: FormGroup;
  imagePreview: string;
  categories = [
    {
      name: 'Mintás pamutvászon',
      value: 'patternedCotton'
    },
    {
      name: 'Egyszínű pamutvászon',
      value: 'plainCotton'
    },
    {
      name: 'Duplagéz',
      value: 'doubleGauze'
    },
    {
      name: 'Minky plüss',
      value: 'minkyPlus'
    },
    {
      name: 'Szalag',
      value: 'ribbon'
    },
    {
      name: 'Gyapjúfilc',
      value: 'woolFelt'
    }
  ];

  constructor(
    private materialService: MaterialService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  onImagePicked(event: Event): void {
    const file = (event.target as HTMLInputElement).files[0];
    this.materialForm.patchValue({ image: file });
    this.materialForm.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  onSubmit(): void {
    if (this.materialForm.valid) {
      const materialData = new FormData();
      materialData.append('name', this.materialForm.get('name').value);
      materialData.append('category', this.materialForm.get('category').value);
      materialData.append('image', this.materialForm.get('image').value);
      materialData.append('extra', this.materialForm.get('extra').value);
      materialData.append(
        'isAvailable',
        this.materialForm.get('isAvailable').value
      );
      this.materialService
        .addMaterial$(materialData)
        .pipe(
          tap(() => {
            this.toastr.success(
              'Siker',
              `${this.materialForm.get('name').value} hozzáadva`
            );
          })
        )
        .subscribe();
    }
  }

  initForm(): void {
    this.materialForm = new FormGroup({
      name: new FormControl(null, Validators.required),
      category: new FormControl(null, Validators.required),
      image: new FormControl(null, Validators.required),
      extra: new FormControl(null, Validators.required),
      isAvailable: new FormControl(true, Validators.required)
    });
  }
}
