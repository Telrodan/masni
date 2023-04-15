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

  trackVisitor(): void {
    this.apiService.get('track').subscribe();
  }

  getTrackingData(): Observable<TrackData[]> {
    return this.apiService
      .get<ApiResponse<TrackData[]>>('track/getData')
      .pipe(map((trackingDTO) => trackingDTO.data));
  }
}
