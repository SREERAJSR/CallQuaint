import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/user/auth/login/login.component';
import { SignupComponent } from './components/user/auth/signup/signup.component';
import { canActivateGuard } from './routeguards/canActivate/can-activate.guard';
import { ForgotpasswordComponent } from './components/user/auth/forgotpassword/forgotpassword.component';
import { ResetpasswordComponent } from './components/user/auth/resetpassword/resetpassword.component';
import { resetpasswordGuard } from './routeguards/canActivate/resetpassword.guard';
import { HomeComponent } from './components/user/publicpages/home/home.component';
import { ErrorpageComponent } from './components/user/publicpages/errorpage/errorpage.component';
import { ConnectComponent } from './components/privatepages/connect/connect.component';
import { authGuard } from './routeguards/canActivate/auth.guard';
import { ChatComponent } from './components/privatepages/chat/chat.component';
import { SubscriptionComponent } from './components/privatepages/subscriptions/subscription/subscription.component';
import { CheckoutComponent } from './components/privatepages/subscriptions/subscription/checkout/checkout.component';



const routes: Routes = [
  
  {path:"home",component:HomeComponent},
  { path: "", redirectTo:"home",pathMatch:'full'},
  { path: "login/:token", component: LoginComponent, canActivate: [canActivateGuard] },
  { path: "login", component: LoginComponent ,canActivate:[authGuard]},
  { path: "signup", component: SignupComponent ,canActivate:[authGuard]},
  { path: "forgot-password", component: ForgotpasswordComponent,canActivate:[authGuard] },
  { path: "reset-password/:token", component: ResetpasswordComponent ,canActivate:[resetpasswordGuard]},
  { path: "connect", component: ConnectComponent },
  { path: "chat", component: ChatComponent },
  {
    path: "subscriptions", component: SubscriptionComponent,
  },
   {path:"subscriptions/checkout",component:CheckoutComponent},
  {path:"**",component:ErrorpageComponent}
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],         
  exports: [RouterModule]
})
export class AppRoutingModule { }    
