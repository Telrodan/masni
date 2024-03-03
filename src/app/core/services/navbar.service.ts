import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { ApiResponse } from '@core/models/api-response.model';
import { map } from 'rxjs';
import { NavbarMenuItem } from '@core/models/navbar-menu-item.model';

@Injectable({
  providedIn: 'root'
})
export class NavbarService {
  constructor(private apiService: ApiService) {}

  getNavbarMenu$() {
    return this.apiService
      .get<ApiResponse<NavbarMenuItem[]>>('category/getNavbarMenu')
      .pipe(map((navbarDTO) => navbarDTO.data));
  }
}
