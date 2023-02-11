import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Material } from '../models/material.model';

import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class MaterialService {
  private materials: Material[];

  constructor(private apiService: ApiService) {}

  public getMaterials(): Material[] {
    return this.materials;
  }

  public fetchMaterials(): Observable<Material[]> {
    return this.apiService.get$<{ materials: Material[] }>('materials').pipe(
      map((materialsDTO) => {
        const materials = materialsDTO.materials.map((rawMaterial: any) => {
          return Material.fromDTO(rawMaterial);
        });
        this.materials = materials;

        return this.materials;
      })
    );
  }
}
