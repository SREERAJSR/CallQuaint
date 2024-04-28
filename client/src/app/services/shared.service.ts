import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  constructor() { }

  private successMessageSource = new Subject<string>();
 successMessges$:Observable<string> = this.successMessageSource.asObservable();
  private errorMessageSource = new Subject<string>();
  errorMessage$: Observable<string> = this.errorMessageSource.asObservable();
  private resetPasswordTokenSource = new BehaviorSubject<string|null>(null);
  resetPasswordToken$: Observable<string|null> = this.resetPasswordTokenSource.asObservable();


  sendSucessMessge(message: string) {
    this.successMessageSource.next(message);
  }
  
  sendErrorMessage(message: string) {
    this.errorMessageSource.next(message)
  }
  sendResetPasswordToken(token: string) {
    this.resetPasswordTokenSource.next(token);
}
}
