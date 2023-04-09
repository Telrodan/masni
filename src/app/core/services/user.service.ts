import { Injectable } from '@angular/core';
import { ApiResponse } from '@core/models/api-response.model';
import { User } from '@core/models/user.model';
import { deleteUser, getProducts, getUsers } from '@core/store';
import { Store } from '@ngrx/store';
import { map, Observable, tap } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private apiService: ApiService, private store: Store) {}

  getUser$(): Observable<User> {
    return this.apiService
      .get<ApiResponse<User>>('users/getMe')
      .pipe(map((userDTO) => userDTO.data));
  }

  getAllUsers$(): Observable<User[]> {
    return this.apiService.get<ApiResponse<User[]>>('users').pipe(
      map((usersDTO) => usersDTO.data),
      tap((users) => this.store.dispatch(getUsers({ users })))
    );
  }

  updateCurrentUser$(user: User): Observable<User> {
    return this.apiService
      .patch<ApiResponse<User>>('users/updateMe', user)
      .pipe(map((userDTO) => userDTO.data));
  }

  deleteUser$(user: User): Observable<null> {
    return this.apiService.delete<null>('users', user._id).pipe(
      tap(() => {
        this.store.dispatch(deleteUser({ user }));
      })
    );
  }
}
