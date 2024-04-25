import { Component, Inject, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader'
import { emailValidator, lowerCaseValidator } from 'src/app/custom-validators/auth-validators';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  constructor(private ngxLoader:NgxUiLoaderService,private toastr: ToastrService) {   
  }    
  ngOnInit(): void {
  }
  hide = true;
  t =this.toastr

  loginForm = new FormGroup({
    email: new FormControl("", [Validators.required, Validators.email ,emailValidator(),lowerCaseValidator()]),
    password: new FormControl("", [Validators.required, Validators.minLength(8), Validators.pattern(new RegExp(
      "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!.@#$%^&*])(?=.{8,})"
    ))])
  })

  loginFormSubmit() {
    console.log(this.loginForm)
    // this.ngxLoader.start('defaut',)
    if(this.loginForm.get('password')?.hasError('pattern'))
    this.toastr.error('Password must contain at least one uppercase letter,one lowercase letter,one number, and one special character','Password Error')
  }
  
}
