import { Injectable } from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HTTP_INTERCEPTORS
} from '@angular/common/http';

import { Observable, throwError, catchError, tap, finalize } from 'rxjs';

import { SpinnerService } from '@core/services/spinner.service';
import { ToastrService } from '@core/services/toastr.service';

@Injectable()
export class HTTPInterceptor implements HttpInterceptor {
  constructor(
    private spinnerService: SpinnerService,
    private toastr: ToastrService
  ) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      tap(() => {
        this.spinnerService.startSpinner();
      }),
      catchError((error: HttpErrorResponse) => {
        let errorMsg = '';
        if (error.error instanceof ErrorEvent) {
          errorMsg = `Error: ${error.error.message}`;
          this.toastr.error(errorMsg);
        } else {
          errorMsg = `Error Code: ${error.status},  Message: ${error.error.message}`;
          this.toastr.error(errorMsg);
        }
        return throwError(() => new Error(errorMsg));
      }),
      finalize(() => {
        this.spinnerService.stopSpinner();
      })
    );
  }
}

export const HttpInterceptorProvider = [
  { provide: HTTP_INTERCEPTORS, useClass: HTTPInterceptor, multi: true }
];
