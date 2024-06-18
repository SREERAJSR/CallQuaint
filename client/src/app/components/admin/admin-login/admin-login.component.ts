import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { emailValidator, lowerCaseValidator } from 'src/app/custom-validators/auth-validators';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css']
})
export class AdminLoginComponent {

  hide:boolean=false
 toastr = inject(ToastrService)
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
      const payload = this.adminloginForm.value as Record<string, string>;
      // this.store.dispatch(loginAction(payload as any))
    }
  }
}
