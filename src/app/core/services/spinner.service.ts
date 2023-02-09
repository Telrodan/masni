import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {
  public spinnerStatusListener = new Subject<boolean>();

  public getSpinnerStatus(): Observable<boolean> {
    return this.spinnerStatusListener.asObservable();
  }

  public startSpinner(): void {
    this.spinnerStatusListener.next(true);
  }

  public stopSpinner(): void {
    this.spinnerStatusListener.next(false);
  }
}
