import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { ApiResponse } from '@core/models/api-response.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FoxpostService {
  constructor(private apiService: ApiService) {}

  getFoxpostMachines(): Observable<any> {
    return this.apiService.get<ApiResponse<any>>('foxpost/getAll');
  }
}
