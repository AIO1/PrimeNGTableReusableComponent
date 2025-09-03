import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class SpinnerService {
  private requestCount = 0;
  private spinnerSubject = new BehaviorSubject<boolean>(false);
  spinner$ = this.spinnerSubject.asObservable();

  private hideTimeout: any; 

  show() {
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
    }
    this.requestCount++;
    if (this.requestCount === 1) {
      this.spinnerSubject.next(true);
    }
  }
  hide() {
    this.requestCount--;
    if (this.requestCount === 0) {
      this.hideTimeout = setTimeout(() => {
        this.spinnerSubject.next(false);
      }, 100);
    }
  }
}
