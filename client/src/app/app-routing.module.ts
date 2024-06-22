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
import { AccountsettingComponent } from './components/privatepages/accountsetting/accountsetting.component';
import { AdminLoginComponent } from './components/admin/admin-login/admin-login.component';
import { AdminDashboardComponent } from './components/admin/admin-dashboard/admin-dashboard.component';
import { AdminUserManagementComponent } from './components/admin/admin-user-management/admin-user-management.component';
import { SubscriptionManagementComponent } from './components/admin/subscription-management/subscription-management.component';
import { PremiumMembersComponent } from './components/admin/premium-members/premium-members.component';
import { SalesReportComponent } from './components/admin/sales-report/sales-report.component';
import { useronlyGuard } from './routeguards/canActivate/useronly.guard';
import { adminOnlyGuard } from './routeguards/canActivate/admin-only.guard';



const routes: Routes = [
  
  {path:"home",component:HomeComponent},
  { path: "", redirectTo:"home",pathMatch:'full'},
  { path: "login/:token", component: LoginComponent, canActivate: [canActivateGuard] },
  { path: "login", component: LoginComponent ,canActivate:[authGuard]},
  { path: "signup", component: SignupComponent ,canActivate:[authGuard]},
  { path: "forgot-password", component: ForgotpasswordComponent,canActivate:[authGuard] },
  { path: "reset-password/:token", component: ResetpasswordComponent ,canActivate:[resetpasswordGuard]},
  { path: "connect", component: ConnectComponent,canActivate:[useronlyGuard]},
  { path: "chat", component: ChatComponent,canActivate:[useronlyGuard] },
  { path: "subscriptions", component: SubscriptionComponent,canActivate:[useronlyGuard]},
  { path: "subscriptions/checkout", component: CheckoutComponent,canActivate:[useronlyGuard] },
  { path: "account", component: AccountsettingComponent,canActivate:[useronlyGuard] },
  { path: 'admin/login', component: AdminLoginComponent },
{path: "admin",component:AdminDashboardComponent,canActivate:[adminOnlyGuard]},
  { path: "admin/user-management", component: AdminUserManagementComponent ,canActivate:[adminOnlyGuard]},
  { path: "admin/subscriptions-management", component: SubscriptionManagementComponent ,canActivate:[adminOnlyGuard]},
  { path: 'admin/premium-members', component: PremiumMembersComponent,canActivate:[adminOnlyGuard] },
{path:'admin/sales-report',component:SalesReportComponent},
  {path:"**",component:ErrorpageComponent}
]
@NgModule({
  imports: [RouterModule.forRoot(routes)],         
  exports: [RouterModule]
})
export class AppRoutingModule { }    
