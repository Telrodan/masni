import { Injectable } from '@angular/core';
import {
    HttpErrorResponse,
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest,
    HTTP_INTERCEPTORS
} from '@angular/common/http';

import { Observable, throwError, catchError } from 'rxjs';

import { ToastrService } from '@core/services/toastr.service';

@Injectable()
export class HTTPInterceptor implements HttpInterceptor {
    constructor(private toastr: ToastrService) {}

    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        return next.handle(request).pipe(
            catchError((error: HttpErrorResponse) => {
                let errorMsg = '';
                errorMsg = error.error.message;
                if (errorMsg) {
                    this.toastr.error(errorMsg);
                } else {
                    console.log('error', error);
                    this.toastr.error('Hiba történt! Kérjük próbálja újra később!');
                }

                return throwError(() => new Error(errorMsg));
            })
        );
    }
}

export const HttpInterceptorProvider = [
    { provide: HTTP_INTERCEPTORS, useClass: HTTPInterceptor, multi: true }
];
