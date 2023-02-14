import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {
  public isLoading = true;

  public spinnerStatusListener = new Subject<boolean>();

  public getSpinnerInitialState(): boolean {
    return this.isLoading;
  }

  public getSpinnerStatus(): Observable<boolean> {
    return this.spinnerStatusListener.asObservable();
  }

  public startSpinner(): void {
    document.body.style.overflow = 'hidden';
    this.spinnerStatusListener.next(true);
  }

  public stopSpinner(): void {
    document.body.style.overflow = 'scroll';
    this.spinnerStatusListener.next(false);
  }
}
