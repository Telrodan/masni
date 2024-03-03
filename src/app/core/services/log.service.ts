import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable, map } from 'rxjs';
import { Log } from '@core/models/log.model';
import { ApiResponse } from '@core/models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class LogService {
  constructor(private apiService: ApiService) {}

  getLogs(): Observable<Log[]> {
    return this.apiService
      .get<ApiResponse<Log[]>>('log/getAll')
      .pipe(map((logsDTO) => logsDTO.data));
  }

  getItemLogsByItemId$(itemId: string): Observable<Log[]> {
    return this.apiService
      .get<ApiResponse<Log[]>>(`log/getLogsByItemId/${itemId}`)
      .pipe(map((logsDTO) => logsDTO.data));
  }
}
