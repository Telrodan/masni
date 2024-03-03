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
        // this.spinnerService.startSpinner();
      }),
      catchError((error: HttpErrorResponse) => {
        let errorMsg = '';
        errorMsg = error.error.message;
        if (errorMsg) {
          this.toastr.error(errorMsg);
        }

        return throwError(() => new Error(errorMsg));
      }),
      finalize(() => {
        // this.spinnerService.stopSpinner();
      })
    );
  }
}

export const HttpInterceptorProvider = [
  { provide: HTTP_INTERCEPTORS, useClass: HTTPInterceptor, multi: true }
];
