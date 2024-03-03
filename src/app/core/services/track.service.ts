import { Injectable } from '@angular/core';

import { Observable, map } from 'rxjs';
import { ApiResponse } from '@core/models/api-response.model';
import { ApiService } from './api.service';
import { TrackingData } from '@features/admin/components/reports/reports-data.model';

@Injectable({
  providedIn: 'root'
})
export class TrackService {
  constructor(private apiService: ApiService) {}

  trackVisitor(data: boolean): void {
    this.apiService.post('track/trackVisitor', { data }).subscribe();
  }

  getTrackingData$(): Observable<TrackingData> {
    return this.apiService
      .get<ApiResponse<TrackingData>>('track/getAll')
      .pipe(map((trackingDTO) => trackingDTO.data));
  }
}
