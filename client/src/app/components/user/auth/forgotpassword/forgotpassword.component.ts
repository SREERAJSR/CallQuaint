import { Component, OnDestroy, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Subscription } from 'rxjs';
import { emailValidator, lowerCaseValidator } from 'src/app/custom-validators/auth-validators';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.component.html',
  styleUrls: ['./forgotpassword.component.css']
})
export class ForgotpasswordComponent implements OnDestroy {
  formBuilder = inject(FormBuilder);
  authService = inject(AuthService)
  toasterService = inject(ToastrService)
  ngxLoader = inject(NgxUiLoaderService);
  router = inject(Router)
forgotPasswordSubscription?:Subscription
  forgotPasswordForm = this.formBuilder.group({
    email: ["", [Validators.required, Validators.email, emailValidator(), lowerCaseValidator()]],
  })

  forgotPasswordFormSubmit() {
    if (this.forgotPasswordForm.valid) {
      this.ngxLoader.start()
      const payload= this.forgotPasswordForm.value as Record<string,string>;
     this.forgotPasswordSubscription =  this.authService.forgotPasswordRequest(payload).subscribe((data: any) => {
       if (data.statusCode === 200) {
         this.toasterService.success(data.message)
         this.ngxLoader.stop()
        }
       }, (error) => {
       const err = error.error.errorMessage;
            this.toasterService.error(err)
            this.ngxLoader.stop()
      })
    }
  }

  ngOnDestroy(): void {
    this.forgotPasswordSubscription?.unsubscribe()
    }

}
