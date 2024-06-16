import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Subscription } from 'rxjs';
import { confirmPasswordValidator } from 'src/app/custom-validators/auth-validators';
import { AuthService } from 'src/app/services/auth.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-resetpassword',
  templateUrl: './resetpassword.component.html',
  styleUrls: ['./resetpassword.component.css']
})
export class ResetpasswordComponent implements OnInit ,OnDestroy{
  
  constructor() {
    this.resetPasswordForm = this.formbuilder.group({
       password: ["", [Validators.required, Validators.minLength(8), Validators.pattern(new RegExp(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!.@#$%^&*])(?=.{8,})"
      ))]],
      confirm_password: ["", [Validators.required, Validators.minLength(8), Validators.pattern(new RegExp(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!.@#$%^&*])(?=.{8,})"
      )),]]
    })
  }
  ngOnInit(): void {
   this.tokenSubscription= this.sharedServices.resetPasswordToken$.subscribe((token) => {
      this.payloadToken = token as string;
    })
  this.resetPasswordForm?.get('confirm_password')?.setValidators([confirmPasswordValidator(this.resetPasswordForm?.get('password')!)])
  }
  formbuilder = inject(FormBuilder);
  authServices = inject(AuthService);
  sharedServices:SharedService = inject(SharedService);
  toaster: ToastrService = inject(ToastrService)
  ngxLoader: NgxUiLoaderService = inject(NgxUiLoaderService);
  router:Router = inject(Router)
  resetPasswordForm;
  hide = true;
  hide2 = true;
  payloadToken?: string;
  tokenSubscription?: Subscription;


  resetPasswordFormSubmit() {
    if (this.resetPasswordForm.valid && this.payloadToken) {
      this.ngxLoader.start();
      const payload = this.resetPasswordForm.value as Record<string,string>;
      this.authServices.resetPasswordRequest(payload, this.payloadToken!).subscribe((response: any) => {
        if (response.statusCode === 200) {
          this.toaster.success(response.message)
         this.ngxLoader.stop()
        setTimeout(() => {
            this.router.navigate(['/'])
         }, 2000);
        }
      }, (error) => {
        const err = error.error.errorMessage;
            this.toaster.error(err)
          this.ngxLoader.stop()

      })
    }
  }


  ngOnDestroy(): void {
    this.tokenSubscription?.unsubscribe();
  }

}
