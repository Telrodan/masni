import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { AuthData } from '../models/auth-data.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private token: string;
  private tokenTimer: any;
  private userId: string;
  private isAuthenticated = false;
  private authStatusListener = new Subject<boolean>();

  constructor(
    private http: HttpClient,
    private router: Router,
    private apiService: ApiService
  ) {}

  public createUser(email: string, password: string): Observable<AuthData> {
    const user: AuthData = {
      email,
      password
    };
    return this.apiService.post$('user/signup', user);
  }
}
