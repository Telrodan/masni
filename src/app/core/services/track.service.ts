import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable, map } from 'rxjs';
import { TrackData } from '@core/models/track.model';
import { ApiResponse } from '@core/models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class TrackService {
  constructor(private apiService: ApiService) {}

  trackVisitor(data: boolean): void {
    this.apiService.post('track/trackVisitor', { data }).subscribe();
  }

  getTrackingData$(): Observable<TrackData[]> {
    return this.apiService
      .get<ApiResponse<TrackData[]>>('track/getAll')
      .pipe(map((trackingDTO) => trackingDTO.data));
  }
}
