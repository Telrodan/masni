import { Injectable } from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Observable, throwError } from 'rxjs';
import { catchError, tap, finalize } from 'rxjs/operators';

import { SpinnerService } from '../services/spinner.service';

@Injectable()
export class HTTPInterceptor implements HttpInterceptor {
  constructor(
    private spinnerService: SpinnerService,
    private snackBar: MatSnackBar
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
          this.snackBar.open('Kliens oldali hiba!', 'Bezárás', {
            verticalPosition: 'top',
            horizontalPosition: 'right'
          });
        } else {
          this.snackBar.open('Szerver oldali hiba!', 'Bezárás', {
            verticalPosition: 'top',
            horizontalPosition: 'right'
          });
          errorMsg = `Error Code: ${error.status},  Message: ${error.error.message}`;
        }
        return throwError(() => new Error(errorMsg));
      }),
      finalize(() => {
        this.spinnerService.stopSpinner();
      })
    );
  }
}
