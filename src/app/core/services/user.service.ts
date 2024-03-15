import { Injectable } from '@angular/core';
import { ApiResponse } from '@core/models/api-response.model';
import { User } from '@core/models/user.model';
import { map, Observable, tap } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    constructor(private apiService: ApiService) {}

    getUser$(): Observable<User> {
        return this.apiService
            .get<ApiResponse<User>>('users/getMe')
            .pipe(map((userDTO) => userDTO.data));
    }

    getUsers$(): Observable<User[]> {
        return this.apiService
            .get<ApiResponse<User[]>>('users')
            .pipe(map((usersDTO) => usersDTO.data));
    }

    updateCurrentUser$(user: User): Observable<User> {
        return this.apiService
            .patch<ApiResponse<User>>('users/updateMe', user)
            .pipe(map((userDTO) => userDTO.data));
    }

    updateCurrentUserPassword$(passwordObj): Observable<string> {
        return this.apiService
            .patch<ApiResponse<string>>('users/updateMyPassword', passwordObj)
            .pipe(map((responseDTO) => responseDTO.data));
    }

    deleteCurrentUser$(): Observable<null> {
        return this.apiService
            .post<ApiResponse<null>>('users/deleteMe', '')
            .pipe(map((responseDTO) => null));
    }

    deleteUser$(user: User): Observable<null> {
        return this.apiService.delete<null>('users', user.id).pipe();
    }
}
