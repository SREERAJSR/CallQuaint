import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  constructor() { }

  private successMessageSource = new Subject<string>();
 successMessges$:Observable<string> = this.successMessageSource.asObservable();
  private errorMessageSource = new Subject<string>();
  errorMessage$: Observable<string> = this.errorMessageSource.asObservable();
  sendSucessMessge(message: string) {
    this.successMessageSource.next(message);
  }
  
  sendErrorMessage(message: string) {
    this.errorMessageSource.next(message)
  }
}
