import { Injectable, inject } from '@angular/core';

import { Observable, map } from 'rxjs';

import { ApiService } from './api.service';
import { Log } from '@core/store/log/log.model';
import { ApiResponse } from '@core/models/api-response.model';

const ROUTE_PREFIX = 'logs';

@Injectable({
    providedIn: 'root'
})
export class LogService {
    private readonly apiService = inject(ApiService);

    getLogs(): Observable<Log[]> {
        return this.apiService
            .get<ApiResponse<Log[]>>(`${ROUTE_PREFIX}/getAll`)
            .pipe(map((logsDTO) => logsDTO.data));
    }
}
