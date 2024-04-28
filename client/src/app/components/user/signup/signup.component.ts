import { Component, OnInit, inject} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import {  map, tap } from 'rxjs';
import { confirmPasswordValidator, emailValidator, lowerCaseValidator } from 'src/app/custom-validators/auth-validators';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  hide = true
  hide2 = true
  signupForm: FormGroup;
  authServices = inject(AuthService)
  toaster = inject(ToastrService);
  ngxLoader = inject(NgxUiLoaderService)
  constructor(private formbuilder: FormBuilder) {
    this.signupForm = formbuilder.group({
      firstname: ["", [Validators.required]],
      lastname: ["", [Validators.required]],
      email: ["", [Validators.required, Validators.email, emailValidator(), lowerCaseValidator()]],
      password: ["", [Validators.required, Validators.minLength(8), Validators.pattern(new RegExp(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!.@#$%^&*])(?=.{8,})"
      ))]],
      confirm_password: ["", [Validators.required, Validators.minLength(8), Validators.pattern(new RegExp(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!.@#$%^&*])(?=.{8,})"
      )),]]
    })
  }
  ngOnInit(): void {
    this.signupForm?.get('confirm_password')?.setValidators([confirmPasswordValidator(this.signupForm?.get('password')!)])
  }
  signupFormSubmit() {
    if (this.signupForm.valid) {
      this.ngxLoader.start()
      const payload = this.signupForm.value;
      this.authServices.userSignup(payload).
        subscribe((data: any) => {
          if (data.statusCode === 200) {
            this.toaster.success(data.message)
            this.ngxLoader.stop()
          }
        }, error => {
          console.log(error.status)
          if (error.status === 422) {
            const str = error.error.error.details.map((data: any) => data.message).toString()
            this.toaster.error(str)
          this.ngxLoader.stop()
          } else {
            const err = error.error.errorMessage;
            this.toaster.error(err)
            this.ngxLoader.stop()
          }
        })
    }
  }
} 
  