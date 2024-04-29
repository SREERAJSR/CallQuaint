import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/user/auth/login/login.component';
import { SignupComponent } from './components/user/auth/signup/signup.component';
import { canActivateGuard } from './routeguards/canActivate/can-activate.guard';
import { ForgotpasswordComponent } from './components/user/auth/forgotpassword/forgotpassword.component';
import { ResetpasswordComponent } from './components/user/auth/resetpassword/resetpassword.component';
import { resetpasswordGuard } from './routeguards/canActivate/resetpassword.guard';
import { HomeComponent } from './components/user/publicpages/home/home.component';


const routes: Routes = [
  {path:"",component:HomeComponent},
  { path: "login/:token", component: LoginComponent, canActivate: [canActivateGuard] },
  { path: "login", component: LoginComponent },
  { path: "signup", component: SignupComponent },
  { path: "forgot-password", component: ForgotpasswordComponent },
  { path: "reset-password/:token", component: ResetpasswordComponent, canActivate: [resetpasswordGuard] },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],         
  exports: [RouterModule]
})
export class AppRoutingModule { }    
