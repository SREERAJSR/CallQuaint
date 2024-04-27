import { Component, Inject, OnDestroy, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader'
import { Observable, Subscription, catchError, map, pluck, tap, throwError } from 'rxjs';
import { emailValidator, lowerCaseValidator } from 'src/app/custom-validators/auth-validators';
import { AuthService } from 'src/app/services/auth.service';
import { SharedService } from 'src/app/services/shared.service';
import { environment } from 'src/environments/environment.development';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit , OnDestroy{
  constructor(private ngxLoader:NgxUiLoaderService,private toastr: ToastrService) {   
  }    
  authService = inject(AuthService)
  sharedService: SharedService = inject(SharedService)

  ngOnInit(): void {
    this.sharedService.successMessges$.subscribe((message:string) => {
      this.toastr.success(message)
    })
    
    this.sharedService.errorMessage$.subscribe((message: string) => {
      this.toastr.error(message)
    })
  }
  hide = true;
  t = this.toastr
  private userLoginSubscription?: Subscription;



//login reactive form
  loginForm = new FormGroup({
    email: new FormControl("", [Validators.required, Validators.email ,emailValidator(),lowerCaseValidator()]),
    password: new FormControl("", [Validators.required, Validators.minLength(8), Validators.pattern(new RegExp(
      "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!.@#$%^&*])(?=.{8,})"
    ))])
  })

  //submisssion of loginForm
  loginFormSubmit() {
    console.log(this.loginForm)
    // this.ngxLoader.start('defaut',)   
    if(this.loginForm.get('password')?.hasError('pattern'))
      this.toastr.error('Password must contain at least one uppercase letter,one lowercase letter,one number, and one special character', 'Password Error')
    if (this.loginForm.valid) {
        this.ngxLoader.start()
      const payload = this.loginForm.value as Record<string, string>;
      this.userLoginSubscription = this.authService.userLogin(payload).pipe(
      ).subscribe((data: any) => {
        if (data.statusCode === 200) {
          this.toastr.success(data.message)
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
