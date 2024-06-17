import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { emailValidator, lowerCaseValidator } from 'src/app/custom-validators/auth-validators';
import { AuthService } from 'src/app/services/auth.service';
import { ApiResponse } from 'src/app/types/api.interface';

@Component({
  selector: 'app-account-reset-password',
  templateUrl: './account-reset-password.component.html',
  styleUrls: ['./account-reset-password.component.css']
})
export class AccountResetPasswordComponent  implements OnInit {

  formbuilder = inject(FormBuilder)
  
  accountResetForm?: FormGroup
  toastr = inject(ToastrService)
  authService = inject(AuthService)
ngOnInit(): void {
  this.accountResetForm =this.formbuilder.group({
      email: ["", [Validators.required, Validators.email, emailValidator(), lowerCaseValidator()]],
  })
}
  

  submitResetForm() {
    console.log(this.accountResetForm);
    if (this.accountResetForm?.valid) {
      const payload = this.accountResetForm.value as Record<string,string>;
      this.authService.forgotPasswordRequest(payload).subscribe({
        next: (response: ApiResponse) => {
          this.toastr.success(response.message)
        }
      })
    }
  }


}
