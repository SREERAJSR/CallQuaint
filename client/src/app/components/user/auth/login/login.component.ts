import { GoogleLoginProvider, SocialAuthService,  SocialUser } from '@abacritt/angularx-social-login';
import { Component, Inject, OnDestroy, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader'
import { Observable, Subscription, catchError, map, pluck, tap, throwError } from 'rxjs';
import { emailValidator, lowerCaseValidator } from 'src/app/custom-validators/auth-validators';
import { AuthService } from 'src/app/services/auth.service';
import { SharedService } from 'src/app/services/shared.service';
import {Router} from "@angular/router";
import { ApiResponse } from 'src/app/types/api.interface';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/store';
import { loginAction } from 'src/app/store/auth/actions';
import {  selectLoginErrorMessage, selectLoginSucessMessage } from 'src/app/store/auth/selectors';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit , OnDestroy{
  constructor(private ngxLoader:NgxUiLoaderService,private toastr: ToastrService,private store:Store<AppState>) {
  }

  ngOnInit(): void {
    this.sharedService.successMessges$.subscribe((message:string) => {
      this.toastr.success(message)
    })
    this.sharedService.errorMessage$.subscribe((message: string) => {
      this.toastr.error(message)
    })
    //store subscription
    this.store.select(selectLoginSucessMessage).subscribe((message) => {
      if(message)
        this.toastr.success(message)
    })
    this.store.select(selectLoginErrorMessage).subscribe((message) => {
      if(message)
      this.toastr.error(message)
    })

  }
  authService:AuthService = inject(AuthService)
  sharedService: SharedService = inject(SharedService)
  router :Router = inject(Router)
  hide: boolean = true;

  private userLoginSubscription?: Subscription; 
//login reactive form
  loginForm = new FormGroup({
    email: new FormControl("", [Validators.required, Validators.email ,emailValidator(),lowerCaseValidator()]),
    password: new FormControl("", [Validators.required, Validators.minLength(8), Validators.pattern(new RegExp(
      "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!.@#$%^&*])(?=.{8,})"
    ))])
  })

  //submisssion of loginForm
  loginFormSubmit():void {
    if(this.loginForm.get('password')?.hasError('pattern'))
      this.toastr.error('Password must contain at least one uppercase letter,one lowercase letter,one number, and one special character', 'Password Error')
    if (this.loginForm.valid) {
      const payload = this.loginForm.value as Record<string, string>;
      this.store.dispatch(loginAction(payload as any))
    }
  }

  ngOnDestroy(): void {
    this.userLoginSubscription?.unsubscribe()

  }
}
