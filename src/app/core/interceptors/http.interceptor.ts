import { Injectable } from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';

import { Observable, throwError, catchError, tap, finalize } from 'rxjs';
import { MessageService } from 'primeng/api';

import { SpinnerService } from '@core/services/spinner.service';

@Injectable()
export class HTTPInterceptor implements HttpInterceptor {
  constructor(
    private spinnerService: SpinnerService,
    private messageService: MessageService
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
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Message Content'
          });
        } else {
          errorMsg = `Error Code: ${error.status},  Message: ${error.error.message}`;
          this.messageService.add({
            severity: 'error',
            summary: 'Szerver oldali hiba!',
            detail: error.error.message
          });
        }
        return throwError(() => new Error(errorMsg));
      }),
      finalize(() => {
        this.spinnerService.stopSpinner();
      })
    );
  }
}
