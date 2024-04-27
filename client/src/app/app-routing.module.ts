import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/user/login/login.component';
import { SignupComponent } from './components/user/signup/signup.component';
import { canActivateGuard } from './routeguards/can-activate.guard';


 const routes: Routes = [
   {path:"login/:token",component:LoginComponent,canActivate:[canActivateGuard]},
  { path: "login", component: LoginComponent },
   { path: "signup", component: SignupComponent },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],         
  exports: [RouterModule]
})
export class AppRoutingModule { }    
