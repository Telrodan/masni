import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Material } from '@core/models/material.model';
import { MaterialService } from '@core/services/material.service';
import { ToastrService } from '@core/services/toastr.service';
import { materialsSelector } from '@core/store';
import { Store } from '@ngrx/store';
import {
  Observable,
  combineLatest,
  debounceTime,
  filter,
  map,
  startWith,
  switchMap,
  tap
} from 'rxjs';
import { ConfirmDialogComponent } from 'src/app/shared/UI/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'masni-handmade-dolls-material-list',
  templateUrl: './material-list.component.html',
  styleUrls: ['./material-list.component.scss']
})
export class MaterialListComponent implements OnInit {
  isDialogVisible = false;
  material: Material;
  materials$: Observable<Material[]>;
  materialForm: FormGroup;
  categoryForm: FormGroup;
  categories = [
    {
      name: 'Összes',
      value: 'all'
    },
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
    private store: Store,
    private materialService: MaterialService,
    private toastr: ToastrService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.initForm();
    console.log(this.categoryForm.value);

    this.materials$ = combineLatest([
      this.store.select(materialsSelector),
      this.categoryForm.valueChanges.pipe(
        startWith({ category: 'all' }),
        debounceTime(300)
      )
    ]).pipe(
      map(([materials, category]) => {
        let filteredMaterials: Material[] = [];
        if (category.category === 'all') {
          filteredMaterials = materials;
        } else {
          filteredMaterials = materials.filter(
            (material) => material.category === category.category
          );
        }
        return filteredMaterials;
      })
    );
  }

  onEditMaterial(material: Material): void {
    if (material) {
      this.material = material;
      this.materialForm = new FormGroup({
        name: new FormControl(material.name, Validators.required),
        category: new FormControl(material.category, Validators.required),
        extra: new FormControl(material.extra, Validators.required),
        isAvailable: new FormControl(material.isAvailable, Validators.required)
      });
      this.isDialogVisible = true;
    }
  }

  onUpdateMaterial(): void {
    if (this.materialForm.valid) {
      const updatedMaterial: Material = {
        ...this.material,
        ...this.materialForm.value
      };

      this.materialService
        .updateMaterial$(updatedMaterial)
        .pipe(
          tap((material) => {
            this.toastr.success('Siker', `${material.name} módosítva`);
            this.isDialogVisible = false;
          })
        )
        .subscribe();
    }
  }

  onDeleteMaterial(material: Material): void {
    this.dialog
      .open(ConfirmDialogComponent, {
        data: {
          title: 'Megerősítés',
          message: `Biztos törölni szeretnéd "${material.name}" mintát?`,
          confirmButtonText: 'Igen',
          cancelButtonText: 'Nem'
        }
      })
      .afterClosed()
      .pipe(
        filter((confirmed) => !!confirmed),
        switchMap(() => this.materialService.deleteMaterial$(material)),
        tap(() => {
          this.toastr.success('Siker', `${material.name} törölve`);
        })
      )
      .subscribe();
  }

  initForm(): void {
    this.categoryForm = new FormGroup({
      category: new FormControl()
    });
  }
}
