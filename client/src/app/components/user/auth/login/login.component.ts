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
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit , OnDestroy{
  constructor(private ngxLoader:NgxUiLoaderService,private toastr: ToastrService) {
  }

  ngOnInit(): void {
    this.sharedService.successMessges$.subscribe((message:string) => {
      this.toastr.success(message)
    })
    this.sharedService.errorMessage$.subscribe((message: string) => {
      this.toastr.error(message)
    })

  }
  authService:AuthService = inject(AuthService)
  sharedService: SharedService = inject(SharedService)
  router :Router = inject(Router)
  hide:boolean = true;
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
        this.ngxLoader.start()
      const payload = this.loginForm.value as Record<string, string>;
      this.userLoginSubscription = this.authService.userLogin(payload).pipe(
      ).subscribe((response: any) => {
        if (response.statusCode === 200) {
localStorage.setItem('emailaccessToken', response.data.accessToken)
localStorage.setItem('emailrefreshToken', response.data.refreshAccessToken)
          this.toastr.success(response.message)
          this.ngxLoader.stop()
        }
      },
        (error) => {
          const err = error.error.errorMessage;
          this.toastr.error(err)
          this.ngxLoader.stop()
        })
    }
  }

  ngOnDestroy(): void {
    this.userLoginSubscription?.unsubscribe()

  }
}
