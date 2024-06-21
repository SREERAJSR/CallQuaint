import { CUSTOM_ELEMENTS_SCHEMA, ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import  {BrowserAnimationsModule} from '@angular/platform-browser/animations'
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from './material-module/material-module.module';
import { LoginComponent } from './components/user/auth/login/login.component';
import { ReactiveFormsModule } from "@angular/forms";
import { SignupComponent } from './components/user/auth/signup/signup.component';
import { LottifyComponent } from './components/user/lottify/lottify.component';
import { NgxUiLoaderModule,  NgxUiLoaderRouterModule, NgxUiLoaderHttpModule } from "ngx-ui-loader"
import { ngxUiLoaderConfig } from './configs/ngxconfig';
import { toasterConfig } from './configs/toasterConfig';
import {ToastrModule } from 'ngx-toastr';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ForgotpasswordComponent } from './components/user/auth/forgotpassword/forgotpassword.component';
import { ResetpasswordComponent } from './components/user/auth/resetpassword/resetpassword.component';
import { SocialLoginModule, SocialAuthServiceConfig, GoogleSigninButtonModule, } from '@abacritt/angularx-social-login';
import { environment } from 'src/environments/environment.development';
import { HomeComponent } from './components/user/publicpages/home/home.component';
import { ErrorpageComponent } from './components/user/publicpages/errorpage/errorpage.component';
import { NavbarComponent } from './components/user/navbar/navbar.component';
import googleLoginConfig from './configs/googleLogin.config';
import { GoogleAuthComponent } from './components/user/auth/google-auth/google-auth.component';
import { NotificationComponent } from './components/user/navbar/notification/notification.component';
import { FooterComponent } from './components/user/footer/footer.component';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { ConnectComponent } from './components/privatepages/connect/connect.component';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { authReducer } from './store/auth/reducers';
import { appEffects } from './store/auth/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { FriendsComponent } from './components/privatepages/connect/friends/friends.component';
import { RequestsComponent } from './components/privatepages/connect/requests/requests.component';
import { CallsAndHistoryComponent } from './components/privatepages/connect/calls-and-history/calls-and-history.component';
import { CallSetupComponent } from './components/privatepages/connect/call-setup/call-setup.component';
import { CallingscreenComponent } from './components/privatepages/connect/call-setup/callingscreen/callingscreen.component';
import { SelectGenderComponent } from './components/user/publicpages/home/select-gender/select-gender.component';
import { ChatComponent } from './components/privatepages/chat/chat.component';
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';
import { SearchUserDialogComponent } from './components/privatepages/chat/search-user-dialog/search-user-dialog.component';
import { ChatpageComponent } from './components/privatepages/chat/chatpage/chatpage.component';
import { ChatlistComponent } from './components/privatepages/chat/chatlist/chatlist.component';
import { TimeagoPipe } from './pipes/timeago.pipe';
import { TrimSpecialCharPipe } from './pipes/trim-special-char.pipe';
import { MakeFirstCharUppercasePipe } from './pipes/make-first-char-uppercase.pipe';
import { IncomingCallRequestComponent } from './components/call-pages/incoming-call-request/incoming-call-request.component';
import { VideoCallScreeenComponent } from './components/call-pages/video-call-screeen/video-call-screeen.component';
import { GlobalErrorHandler } from './global-error-handler';
import { VoiceCallScreenComponent } from './components/call-pages/voice-call-screen/voice-call-screen.component';
import { SubscriptionComponent } from './components/privatepages/subscriptions/subscription/subscription.component';
import { FormfieldrequiredDirective } from './directives/formfieldrequired.directive';
import { CheckoutComponent } from './components/privatepages/subscriptions/subscription/checkout/checkout.component';
import { GooglePayButtonModule } from '@google-pay/button-angular';
import { AccountsettingComponent } from './components/privatepages/accountsetting/accountsetting.component';
import { PublicprofileComponent } from './components/privatepages/accountsetting/publicprofile/publicprofile.component';
import { AccountResetPasswordComponent } from './components/privatepages/accountsetting/account-reset-password/account-reset-password.component';
import { AdminNavbarComponent } from './components/admin/admin-navbar/admin-navbar.component';
import { AdminLoginComponent } from './components/admin/admin-login/admin-login.component';
import { AdminSidebarComponent } from './components/admin/admin-sidebar/admin-sidebar.component';
import { AdminDashboardComponent } from './components/admin/admin-dashboard/admin-dashboard.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { AdminUserManagementComponent } from './components/admin/admin-user-management/admin-user-management.component';
import { SubscriptionManagementComponent } from './components/admin/subscription-management/subscription-management.component';
import { PremiumMembersComponent } from './components/admin/premium-members/premium-members.component';
import { SalesReportComponent } from './components/admin/sales-report/sales-report.component';
import { YearlyReportComponent } from './components/admin/sales-report/yearly-report/yearly-report.component';
import { MonthlyReportComponent } from './components/admin/sales-report/monthly-report/monthly-report.component';
import { DayReportComponent } from './components/admin/sales-report/day-report/day-report.component';



const token = window.localStorage.getItem('accessToken')
const socketConfig:SocketIoConfig ={url:environment.socket_URL,options:{withCredentials:true,auth:{token}}}


@NgModule({
  declarations: [ 
    AppComponent,
    LoginComponent,  
    SignupComponent,
    LottifyComponent,
    ForgotpasswordComponent,
    ResetpasswordComponent,
    HomeComponent,
    ErrorpageComponent,
    NavbarComponent,
    GoogleAuthComponent,
    NotificationComponent,
    FooterComponent,
    ConfirmDialogComponent,
    ConnectComponent,
    FriendsComponent,
    RequestsComponent,
    CallsAndHistoryComponent,
    CallSetupComponent,
    CallingscreenComponent,
    SelectGenderComponent,
    ChatComponent,
    SearchUserDialogComponent,
    ChatpageComponent,
    ChatlistComponent,
    TimeagoPipe,
    TrimSpecialCharPipe,
    MakeFirstCharUppercasePipe,
    IncomingCallRequestComponent,
    VideoCallScreeenComponent,
    VoiceCallScreenComponent,
    SubscriptionComponent,
    FormfieldrequiredDirective,
    CheckoutComponent,
    AccountsettingComponent,
    PublicprofileComponent,
    AccountResetPasswordComponent,
    AdminNavbarComponent,
    AdminLoginComponent,
    AdminSidebarComponent,
    AdminDashboardComponent,
    AdminUserManagementComponent,
    SubscriptionManagementComponent,
    PremiumMembersComponent,
    SalesReportComponent,
    YearlyReportComponent,
    MonthlyReportComponent,
    DayReportComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    MaterialModule,
    ReactiveFormsModule,
    NgxUiLoaderModule.forRoot(ngxUiLoaderConfig),
    NgxUiLoaderRouterModule,
    ToastrModule.forRoot(toasterConfig),
    SocialLoginModule,
    GoogleSigninButtonModule,
    EffectsModule.forRoot([appEffects]),
    StoreModule.forRoot({ auth: authReducer }),
   StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: environment.production,
   }),
    SocketIoModule.forRoot(socketConfig),
    GooglePayButtonModule,
    NgApexchartsModule
  ],
  providers: [
  {provide:ErrorHandler,useClass:GlobalErrorHandler},
      {provide:HTTP_INTERCEPTORS,useClass:AuthInterceptor,multi:true},
    {
      provide: 'SocialAuthServiceConfig',
    useValue: {
        autoLogin: false,
        providers: [
         googleLoginConfig
        ],
        onError: (err) => {
          console.error(err);
        }
      } as SocialAuthServiceConfig,
  }
  ],
  schemas:[CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})
export class AppModule { }

