import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { CookieService } from './cookie.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private http: HttpClient, private cookieService: CookieService) {}

  post<T>(endpoint: string, data: any): Observable<T> {
    return <Observable<T>>(
      this.http.post(`${environment.apiUrl}${endpoint}`, data)
    );
  }

  get<T>(endpoint: string, params?: any): Observable<T> {
    return <Observable<T>>(
      this.http.get(`${environment.apiUrl}${endpoint}`, { params })
    );
  }

  delete<T>(endpoint: string, id: string): Observable<T> {
    return <Observable<T>>(
      this.http.delete(`${environment.apiUrl}${endpoint}/` + id)
    );
  }

  patch<T>(endpoint: string, data: any): Observable<T> {
    return <Observable<T>>(
      this.http.patch(`${environment.apiUrl}${endpoint}`, data, data.id)
    );
  }
}
