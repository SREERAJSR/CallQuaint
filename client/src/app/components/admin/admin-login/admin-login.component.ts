import { Component, OnDestroy, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { emailValidator, lowerCaseValidator } from 'src/app/custom-validators/auth-validators';
import { AdminService } from 'src/app/services/admin.service';
import { AuthService } from 'src/app/services/auth.service';
import { AdminLoginPayload } from 'src/app/types/admin.intefaces';
import { ApiResponse } from 'src/app/types/api.interface';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css']
})
export class AdminLoginComponent implements OnDestroy {

  adminServices = inject(AdminService)
  authService = inject(AuthService)
  router  = inject(Router)
  toastr = inject(ToastrService)
  hide: boolean = true
  loginAdminSubscripton?:Subscription
  adminloginForm = new FormGroup({
    email: new FormControl("", [Validators.required, Validators.email ,emailValidator(),lowerCaseValidator()]),
    password: new FormControl("", [Validators.required, Validators.minLength(8), Validators.pattern(new RegExp(
      "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!.@#$%^&*])(?=.{8,})"
    ))])
  })

  //submisssion of adminloginForm

  adminloginFormSubmit():void {
    if(this.adminloginForm.get('password')?.hasError('pattern'))
      this.toastr.error('Password must contain at least one uppercase letter,one lowercase letter,one number, and one special character', 'Password Error')
    if (this.adminloginForm.valid) {
      const payload = this.adminloginForm.value as AdminLoginPayload;
    this.loginAdminSubscripton=  this.adminServices.loginAdmin(payload).subscribe({
        next: (response: ApiResponse) => {
          if (response.statusCode === 200) {  
            this.authService.setAdminAccessToken(response.data.accessToken)
            this.authService.setAdminRefreshToken(response.data.refreshToken)
            this.router.navigate(['/admin'])
            this.toastr.success("Admin login sucess")
          }
        }
      })
    }
  }

  ngOnDestroy(): void {
    this.loginAdminSubscripton?.unsubscribe()
  }
}
